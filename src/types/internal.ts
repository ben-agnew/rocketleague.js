import { Segments, TrackerPlatformInfo } from './tracker';

export type Platform = 'steam' | 'epic' | 'psn' | 'xbl';

export type TPlaylists = 'Ranked Duel 1v1' | 'Ranked Doubles 2v2' | 'Ranked Standard 3v3' | 'Hoops' | 'Rumble' | 'Dropshot' | 'Snowday';
export type Ranks =
    | 'Unranked'
    | 'Bronze I'
    | 'Bronze II'
    | 'Bronze III'
    | 'Silver I'
    | 'Silver II'
    | 'Silver III'
    | 'Gold I'
    | 'Gold II'
    | 'Gold III'
    | 'Platinum I'
    | 'Platinum II'
    | 'Platinum III'
    | 'Diamond I'
    | 'Diamond II'
    | 'Diamond III'
    | 'Champion I'
    | 'Champion II'
    | 'Champion III'
    | 'Grand Champion I'
    | 'Grand Champion II'
    | 'Grand Champion III'
    | 'Supersonic Legend';

export type Divisions = 'Division I' | 'Division II' | 'Division III' | 'Division IV';

export type GenericOptions = {
    raw?: boolean;
};

export type OverviewStats = {
    wins: number;
    goals: number;
    mVPs: number;
    saves: number;
    assists: number;
    shots: number;
    goalShotRatio: number;
    score: number;
    seasonRewardLevel: number;
    seasonRewardWins: number;
    tRNRating: number;
    _raw?: Segments;
};

export type PlaylistStats = {
    rank: Ranks;
    tier: number;
    division: number;
    deltaUp: number | null;
    deltaDown: number | null;
    matchesPlayed: number;
    winStreak: number;
    rating: number;
    peakRating: number | null;
    _raw?: Segments;
};

export type GamemodesStats = {
    [k in TPlaylists]: PlaylistStats;
};

export type AllStats = {
    overview: OverviewStats;
    gamemodes: GamemodesStats;
};

export type Userinfo = {
    platform: TrackerPlatformInfo['platformSlug'];
    uuid: TrackerPlatformInfo['platformUserId'];
    name: TrackerPlatformInfo['platformUserHandle'];
    userid: TrackerPlatformInfo['platformUserIdentifier'];
    avatar: TrackerPlatformInfo['avatarUrl'];
};
