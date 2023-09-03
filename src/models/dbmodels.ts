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
    sentiment : string;
    count : number;
}

export interface IIntentCount {
    intent : string;
    count : number;
}

export interface IOffensiveCount {
    offensive : string;
    count : number;
}