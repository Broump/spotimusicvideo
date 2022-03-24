from pprint import pprint
import requests
import time
import urllib.request
import json
import os
import youtube_dl
import sys
from youtubesearchpython import VideosSearch

SPOTIFY_GET_CURRENT_TRACK_URL = "https://api.spotify.com/v1/me/player"


def get_youtube_video(search_keyword):
    videosSearch = VideosSearch(search_keyword, limit=1)

    videosSearchResult = videosSearch.result()

    return(videosSearchResult["result"][0]["link"])


def get_current_track(acces_token):
    response = requests.get(
        SPOTIFY_GET_CURRENT_TRACK_URL,
        headers={
            "Authorization": f'Bearer {acces_token}'
        }
    )

    resp_json = response.json()

    progress_ms = resp_json["progress_ms"]
    progress_s = progress_ms/1000

    duration_ms = resp_json["item"]["duration_ms"]
    duration_s = duration_ms/1000

    track_name = resp_json["item"]["name"]

    album_cover = resp_json["item"]["album"]["images"][0]["url"]

    artists = resp_json["item"]["artists"]
    artists_names = ", ".join([artist["name"] for artist in artists])

    youtube_link = get_youtube_video(track_name+artists_names)

    current_track_info = {
        "track_name": track_name,
        "artists": artists_names,
        "album_cover": album_cover,
        "progress_s": progress_s,
        "duration_s": duration_s,
        "link": youtube_link,
    }

    try:
        resp_json["currently_playing_type"]

        istrack = True
    except:
        istrack = False

    return (current_track_info)


def get_youtube_video(search_keyword):
    videosSearch = VideosSearch(search_keyword, limit=5)

    videosSearchResult = videosSearch.result()

    results = []

    index = 0

    for video in videosSearchResult["result"]:
        if "Lyric" not in videosSearchResult["result"][index]["title"]:
            results.append(videosSearchResult["result"][index]["link"])

        index = index + 1

    return(results[0])


def get_youtube_video_src(search):
    youtube_link = get_youtube_video(search)

    opts = ['-g', youtube_link]
    youtube_dl.main(opts)


def main(SPOTIFY_ACCES_TOKEN):
    last_track = ""
    # while True:
    try:
        current_track_info = get_current_track(SPOTIFY_ACCES_TOKEN)
        if (current_track_info["track_name"] != last_track):
            print(json.dumps(current_track_info))
            # pprint(get_youtube_video_src(
            #     current_track_info["track_name"]+current_track_info["artists"]))
        else:
            print("notrack")
        last_track = current_track_info["track_name"]

    except:
        print("notrack")

        # time.sleep(1)


main(sys.argv[1])

sys.stdout.flush()
