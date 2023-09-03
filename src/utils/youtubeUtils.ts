import axios from 'axios'

export async function isValidVideoId(videoId: string) {
    const url = "http://img.youtube.com/vi/" + videoId + "/mqdefault.jpg";
    const res = await axios.get(url);
    if(!res.data) {
        return false;
    }
    return true;
}

function fetch(url: string) {
    throw new Error('Function not implemented.');
}
