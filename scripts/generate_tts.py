"""
ナレーション音声生成スクリプト

CustomVoiceモード:
  python generate_tts.py --text "テキスト" --speaker "Ono_Anna" --output /path/to/output.wav

VoiceDesignモード（プリセット）:
  python generate_tts.py --text "テキスト" --preset "女性（標準）" --output /path/to/output.wav
"""
import argparse
import shutil
import tempfile
from pathlib import Path

PRESETS_FILE = "/Users/keeee/Desktop/Dev/Qwen3-TTS/voice_presets.json"
CUSTOM_VOICE_MODEL = "/Users/keeee/Desktop/Dev/Qwen3-TTS/Qwen3-TTS-12Hz-1.7B-CustomVoice-8bit-mlx"
VOICE_DESIGN_MODEL = "/Users/keeee/Desktop/Dev/Qwen3-TTS/Qwen3-TTS-12Hz-1.7B-VoiceDesign-8bit-mlx"

SPEAKERS = ["Ono_Anna", "Sohee", "Vivian", "Serena", "Ryan", "Aiden", "Uncle_Fu", "Dylan", "Eric"]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True, help="読み上げるテキスト")
    parser.add_argument("--speaker", help="話者名（CustomVoiceモード）例: Ono_Anna")
    parser.add_argument("--preset", help="プリセット名（VoiceDesignモード）")
    parser.add_argument("--output", required=True, help="出力wavファイルパス")
    args = parser.parse_args()

    if not args.speaker and not args.preset:
        print("エラー: --speaker または --preset のどちらかを指定してください")
        exit(1)

    from mlx_audio.tts.utils import load_model
    from mlx_audio.tts.generate import generate_audio

    if args.speaker:
        if args.speaker not in SPEAKERS:
            print(f"エラー: 話者 '{args.speaker}' が見つかりません")
            print("利用可能な話者:", SPEAKERS)
            exit(1)
        print(f"モード: CustomVoice / 話者: {args.speaker}")
        print(f"テキスト: {args.text}")
        print("モデルを読み込み中...")
        model = load_model(CUSTOM_VOICE_MODEL)
        with tempfile.TemporaryDirectory() as tmp_dir:
            print("音声を生成中...")
            generate_audio(
                text=args.text,
                model=model,
                voice=args.speaker,
                lang_code="ja",
                output_path=tmp_dir,
                file_prefix="output",
                verbose=False,
            )
            shutil.copy(Path(tmp_dir) / "output_000.wav", args.output)

    else:
        import json
        with open(PRESETS_FILE, encoding="utf-8") as f:
            presets = json.load(f)
        if args.preset not in presets:
            print(f"エラー: プリセット '{args.preset}' が見つかりません")
            print("利用可能なプリセット:", list(presets.keys()))
            exit(1)
        instruct = presets[args.preset]
        print(f"モード: VoiceDesign / プリセット: {args.preset}")
        print(f"テキスト: {args.text}")
        print("モデルを読み込み中...")
        model = load_model(VOICE_DESIGN_MODEL)
        with tempfile.TemporaryDirectory() as tmp_dir:
            print("音声を生成中...")
            generate_audio(
                text=args.text,
                model=model,
                lang_code="ja",
                instruct=instruct,
                output_path=tmp_dir,
                file_prefix="output",
                verbose=False,
            )
            shutil.copy(Path(tmp_dir) / "output_000.wav", args.output)

    print(f"完了: {args.output}")

if __name__ == "__main__":
    main()
