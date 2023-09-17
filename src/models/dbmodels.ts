export interface IUserDetails {
    firstName : string;
    lastName : string;
    email : string;
    createdOn : Date;
    updatedOn : Date;
    status : number;
}

export interface IVideoDetails {
    videoId : string;
    title : string;
    description : string;
    tags : string;
    categoryId : string;
    publishedAt : Date;
    viewCount : number;
    likeCount : number;
    commentCount : number;
    favoriteCount : number;
    channelId : string;
    channelTitle : string;
    liveBroadcastContent : string;
    defaultAudioLanguage : string;
    duration : string;
    licensedContent : boolean;
    video_data_status : number
}

export interface ISentimentCount {
    type : string;
    count : number;
}

export interface IIntentCount {
    type : string;
    count : number;
}

export interface IOffensiveCount {
    type : string;
    count : number;
}

export interface IYoutubeComment {
    commentId : string;
    comment : string;
    textOriginal : string;
    authorChannelUrl : string;
    authorProfileImageUrl : string;
    authorDisplayName : string;
    authorChannelId : string;
    likeCount : number;
    publishedAt : Date;
    updatedAt : Date;
    totalReplyCount : number;
    videoId : string;
    Sentiment : string;
    Offensive : string;
    Intent : string;
    sentiment_score : number;
    intent_score : number;
    offense_score : number;
    addedAt : Date;
}

export interface IYoutubeComments {
    totalCount: number;
    comments: IYoutubeComment[];
}