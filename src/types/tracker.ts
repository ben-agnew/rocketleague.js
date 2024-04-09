import { Divisions, TPlaylists, Ranks } from './internal';

export type TrackerPlatformInfo = {
    platformSlug: string;
    platformUserId: string;
    platformUserHandle: string;
    platformUserIdentifier: string;
    avatarUrl: string | null;
    additionalParameters: unknown | null;
};

export type TrackerUserInfo = {
    userId: unknown;
    isPremium: boolean;
    isVerified: boolean;
    isInfluencer: boolean;
    isPartner: boolean;
    countryCode: string | null;
    customAvatarUrl: string | null;
    customHeroUrl: string | null;
    customAvatarFrame: unknown;
    customAvatarFrameInfo: unknown;
    premiumDuration: unknown;
    socialAccounts: unknown[];
    pageviews: number;
    xpTier: unknown;
    isSuspicious: boolean | null;
};

export type TrackerMetadata = {
    lastUpdated?: {
        value: string;
        displayValue: string;
    };
    playerId: number;
    currentSeason: number;
};

type SegmentStatsBase = {
    rank: number | unknown | null;
    percentile: unknown | null;
    displayName: string;
    displayCategory: string;
    category: string;
    description: unknown | null;
    value: number;
    displayValue: string;
    displayType: string;
};

type SegmentStatsTier = SegmentStatsBase & {
    metadata: {
        iconUrl: string;
        name: Ranks;
    };
};

type SegmentStatsDivision = SegmentStatsBase & {
    metadata: {
        deltaDown: number | null | undefined;
        deltaUp: number | null | undefined;
        name: Divisions;
    };
};

type SegmentStatsWinStreak = SegmentStatsBase & {
    metadata: {
        type: 'win' | 'loss';
    };
};

type SegmentStatsRating = SegmentStatsBase & {
    metadata: {
        iconUrl: string;
        tierName: Ranks;
    };
};

type SegmentStatsPeakRating = SegmentStatsBase & {
    metadata: {
        iconUrl: string;
        tierName: Ranks;
    };
    value: number | null;
};

export type SegmentOverviewStats = {
    wins: SegmentStatsBase;
    goals: SegmentStatsBase;
    mVPs: SegmentStatsBase;
    saves: SegmentStatsBase;
    assists: SegmentStatsBase;
    shots: SegmentStatsBase;
    goalShotRatio: SegmentStatsBase;
    score: SegmentStatsBase;
    seasonRewardLevel: SegmentStatsBase;
    seasonRewardWins: SegmentStatsBase;
    tRNRating: SegmentStatsBase;
};

export type SegmentPlaylistStats = {
    tier: SegmentStatsTier;
    division: SegmentStatsDivision;
    matchesPlayed: SegmentStatsBase;
    winStreak: SegmentStatsWinStreak;
    rating: SegmentStatsRating;
    peakRating: SegmentStatsPeakRating;
};

export type Segments = {
    attributes?: {
        playlistId: number;
        season: number;
        key?: string | null;
    };

    expiryDate: string;
} & (SegmentsOverview | SegmentsPlaylist);

export type SegmentsOverview = {
    type: 'overview';
    stats: SegmentOverviewStats;
    metadata: {
        name: 'LifeTime';
    };
};

export type SegmentsPlaylist = {
    type: 'playlist';
    stats: SegmentPlaylistStats;
    metadata: {
        name: TPlaylists;
    };
};

export type TrackerResponse = {
    data: {
        platformInfo: TrackerPlatformInfo;
        userInfo: TrackerUserInfo;
        metadata: TrackerMetadata;
        segments: Segments[];
        availableSegments: unknown[];
        expiryDate: string;
    };
    errors?: { message: string }[];
};
