import { exec } from 'child_process';
import { AllStats, GenericOptions, OverviewStats, Platform, PlaylistStats, TPlaylists, Ranks, Userinfo } from './types/internal';
import { SegmentOverviewStats, SegmentPlaylistStats, Segments, SegmentsPlaylist, TrackerResponse } from './types/tracker';

const PLATFORM = {
    Steam: 'steam',
    Epic: 'epic',
    Playstation: 'psn',
    Xbox: 'xbl',
} as const;

const BASE_URL = `https://api.tracker.gg/api/v2/rocket-league/standard/profile/{PLATFORM}/{USERNAME}`;

const fetchData = (url: string): Promise<TrackerResponse> =>
    new Promise((resolve, reject) => {
        exec(`curl --max-time 5 --user-agent 'Chrome/121' --url ${url}`, (err, result) => {
            if (!result) {
                reject(err);
            }
            try {
                const jsonResult = JSON.parse(result);
                resolve(jsonResult);
            } catch (error) {
                reject(error);
            }
        });
    });

class API {
    platform: Platform;
    username: string;
    _raw: TrackerResponse | undefined = undefined;

    constructor(platform: Platform, username: string) {
        this.platform = platform;
        this.username = username;
    }

    static async fetchUser(platform: Platform, username: string) {
        const instance = new API(platform, username);
        instance._raw = await fetchData(BASE_URL.replace('{PLATFORM}', platform).replace('{USERNAME}', username));
        if ((instance._raw.errors?.length ?? 0) > 0) throw new Error(instance._raw?.errors?.[0]?.message);
        return instance;
    }

    overview(options: GenericOptions = {}): OverviewStats {
        if (!this._raw) throw new Error('No data found');
        const data = this._raw.data.segments.find((x) => x.type === 'overview');
        if (!data) throw new Error('No overview data found');

        const stats = data.stats as SegmentOverviewStats;

        return {
            assists: stats.assists.value,
            goals: stats.goals.value,
            goalShotRatio: stats.goalShotRatio.value,
            mVPs: stats.mVPs.value,
            saves: stats.saves.value,
            score: stats.score.value,
            seasonRewardLevel: stats.seasonRewardLevel.value,
            seasonRewardWins: stats.seasonRewardWins.value,
            shots: stats.shots.value,
            tRNRating: stats.tRNRating.value,
            wins: stats.wins.value,
            _raw: options.raw ? data : undefined,
        };
    }

    private returnStats(stats: SegmentPlaylistStats, rawData: Segments, raw: boolean): PlaylistStats {
        return {
            division: stats.division.value,
            deltaUp: stats.division.metadata.deltaUp ?? null,
            deltaDown: stats.division.metadata.deltaDown ?? null,
            matchesPlayed: stats.matchesPlayed.value,
            peakRating: stats.peakRating.value,
            rank: stats.tier.metadata.name,
            rating: stats.rating.value,
            tier: stats.tier.value,
            winStreak: stats.winStreak.displayValue === '0' ? 0 : parseInt(stats.winStreak.displayValue, 10),
            _raw: raw ? rawData : undefined,
        };
    }

    private getRankData(playlistName: TPlaylists, options: GenericOptions = {}) {
        if (!this._raw) throw new Error('No data found');

        const data = this._raw.data.segments.find((x) => x?.metadata?.name === playlistName);
        if (!data) throw new Error(`No ${playlistName} data found`);
        const stats = data.stats as SegmentPlaylistStats;

        return this.returnStats(stats, data, options.raw ?? false);
    }
    get1v1(options: GenericOptions = {}): PlaylistStats {
        return this.getRankData('Ranked Duel 1v1', options);
    }

    get2v2(options: GenericOptions = {}): PlaylistStats {
        return this.getRankData('Ranked Doubles 2v2', options);
    }

    get3v3(options: GenericOptions = {}): PlaylistStats {
        return this.getRankData('Ranked Standard 3v3', options);
    }

    getData() {
        const result = {} as AllStats;
        result.overview = this.overview();
        result.gamemodes = {} as AllStats['gamemodes'];
        if (!this._raw) throw new Error('No data found');

        const playlists = this._raw.data.segments.filter((x) => x.type === 'playlist') as (SegmentsPlaylist & Segments)[];
        for (const playlist of playlists) {
            if (playlist) {
                const stats = playlist.stats as SegmentPlaylistStats;
                result.gamemodes[playlist.metadata.name] = {} as PlaylistStats;
                result.gamemodes[playlist.metadata.name]['rank'] = stats.tier.metadata.name;
                result.gamemodes[playlist.metadata.name] = this.returnStats(stats, playlist, false);
            }
        }

        return result;
    }

    getUserinfo() {
        const result = {} as Userinfo;
        if (!this._raw) throw new Error('No data found');
        const platform = this._raw.data.platformInfo;

        result.platform = platform.platformSlug;
        result.uuid = platform.platformUserId;
        result.name = platform.platformUserHandle;
        result.userid = platform.platformUserIdentifier;
        result.avatar = platform.avatarUrl;

        return result;
    }

    get raw() {
        return this._raw;
    }
}

export {
    API as RLAPI, // Compability
    API,
    PLATFORM,
};
