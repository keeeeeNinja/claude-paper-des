"""
ナレーション音声生成スクリプト

Qwen3-TTS CustomVoiceモード:
  python generate_tts.py --text "テキスト" --speaker "Ono_Anna" --output /path/to/output.wav

Qwen3-TTS VoiceDesignモード（プリセット）:
  python generate_tts.py --text "テキスト" --preset "女性（標準）" --output /path/to/output.wav

VOICEVOXモード:
  python generate_tts.py --text "テキスト" --voicevox-id 13 --output /path/to/output.wav
"""
import argparse
import shutil
import tempfile
from pathlib import Path

PRESETS_FILE = "/Users/keeee/Desktop/Dev/Qwen3-TTS/voice_presets.json"
CUSTOM_VOICE_MODEL = "/Users/keeee/Desktop/Dev/Qwen3-TTS/Qwen3-TTS-12Hz-1.7B-CustomVoice-8bit-mlx"
VOICE_DESIGN_MODEL = "/Users/keeee/Desktop/Dev/Qwen3-TTS/Qwen3-TTS-12Hz-1.7B-VoiceDesign-8bit-mlx"
VOICEVOX_URL = "http://localhost:50021"

SPEAKERS = ["Ono_Anna", "Sohee", "Vivian", "Serena", "Ryan", "Aiden", "Uncle_Fu", "Dylan", "Eric"]


def generate_voicevox(text, speaker_id, output_path):
    import urllib.request
    import urllib.parse
    import json

    # audio_query
    query_url = f"{VOICEVOX_URL}/audio_query?text={urllib.parse.quote(text)}&speaker={speaker_id}"
    req = urllib.request.Request(query_url, method="POST")
    with urllib.request.urlopen(req) as res:
        audio_query = json.loads(res.read())

    # synthesis
    synth_url = f"{VOICEVOX_URL}/synthesis?speaker={speaker_id}"
    body = json.dumps(audio_query).encode("utf-8")
    req = urllib.request.Request(synth_url, data=body, method="POST",
                                  headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as res:
        wav_data = res.read()

    with open(output_path, "wb") as f:
        f.write(wav_data)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True, help="読み上げるテキスト")
    parser.add_argument("--speaker", help="話者名（Qwen3-TTS CustomVoiceモード）例: Ono_Anna")
    parser.add_argument("--preset", help="プリセット名（Qwen3-TTS VoiceDesignモード）")
    parser.add_argument("--voicevox-id", type=int, help="話者ID（VOICEVOXモード）例: 13")
    parser.add_argument("--output", required=True, help="出力wavファイルパス")
    args = parser.parse_args()

    if not args.speaker and not args.preset and args.voicevox_id is None:
        print("エラー: --speaker / --preset / --voicevox-id のいずれかを指定してください")
        exit(1)

    if args.voicevox_id is not None:
        print(f"モード: VOICEVOX / 話者ID: {args.voicevox_id}")
        print(f"テキスト: {args.text}")
        print("音声を生成中...")
        generate_voicevox(args.text, args.voicevox_id, args.output)

    elif args.speaker:
        if args.speaker not in SPEAKERS:
            print(f"エラー: 話者 '{args.speaker}' が見つかりません")
            print("利用可能な話者:", SPEAKERS)
            exit(1)
        from mlx_audio.tts.utils import load_model
        from mlx_audio.tts.generate import generate_audio
        print(f"モード: Qwen3-TTS CustomVoice / 話者: {args.speaker}")
        print(f"テキスト: {args.text}")
        print("モデルを読み込み中...")
        model = load_model(CUSTOM_VOICE_MODEL)
        with tempfile.TemporaryDirectory() as tmp_dir:
            print("音声を生成中...")
            generate_audio(text=args.text, model=model, voice=args.speaker,
                           lang_code="ja", output_path=tmp_dir,
                           file_prefix="output", verbose=False)
            shutil.copy(Path(tmp_dir) / "output_000.wav", args.output)

    else:
        import json
        from mlx_audio.tts.utils import load_model
        from mlx_audio.tts.generate import generate_audio
        with open(PRESETS_FILE, encoding="utf-8") as f:
            presets = json.load(f)
        if args.preset not in presets:
            print(f"エラー: プリセット '{args.preset}' が見つかりません")
            print("利用可能なプリセット:", list(presets.keys()))
            exit(1)
        instruct = presets[args.preset]
        print(f"モード: Qwen3-TTS VoiceDesign / プリセット: {args.preset}")
        print(f"テキスト: {args.text}")
        print("モデルを読み込み中...")
        model = load_model(VOICE_DESIGN_MODEL)
        with tempfile.TemporaryDirectory() as tmp_dir:
            print("音声を生成中...")
            generate_audio(text=args.text, model=model, lang_code="ja",
                           instruct=instruct, output_path=tmp_dir,
                           file_prefix="output", verbose=False)
            shutil.copy(Path(tmp_dir) / "output_000.wav", args.output)

    print(f"完了: {args.output}")


if __name__ == "__main__":
    main()
