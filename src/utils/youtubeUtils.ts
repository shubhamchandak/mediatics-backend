import axios from 'axios'

export async function isValidVideoId(videoId: string): Promise<boolean> {
    const url = "http://img.youtube.com/vi/" + videoId + "/mqdefault.jpg";
    try {
        const res = await axios.get(url);
        if(res.data) {
            return true;
        }
    } catch(error) {
        console.log("error: Video does not exist with videoId ", videoId);
    }
    return false;
}

export async function getVideoIdFromUrl(url: string): Promise<string | null> {
    const regex: RegExp = new RegExp(/(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/)
    const match = regex.exec(url);
    if(match && (await isValidVideoId(match[1]))) {
        return match[1];
    }
    return null;
}
