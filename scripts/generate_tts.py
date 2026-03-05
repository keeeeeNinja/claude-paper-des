"""
ナレーション音声生成スクリプト
使い方: python generate_tts.py --text "テキスト" --preset "女性（標準）" --output /path/to/output.wav
"""
import argparse
import json
import shutil
import tempfile
from pathlib import Path

PRESETS_FILE = "/Users/keeee/Desktop/Dev/Qwen3-TTS/voice_presets.json"
MODEL_PATH = "/Users/keeee/Desktop/Dev/Qwen3-TTS/Qwen3-TTS-12Hz-1.7B-VoiceDesign-8bit-mlx"

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True, help="読み上げるテキスト")
    parser.add_argument("--preset", required=True, help="プリセット名")
    parser.add_argument("--output", required=True, help="出力wavファイルパス")
    args = parser.parse_args()

    with open(PRESETS_FILE, encoding="utf-8") as f:
        presets = json.load(f)

    if args.preset not in presets:
        print(f"エラー: プリセット '{args.preset}' が見つかりません")
        print("利用可能なプリセット:", list(presets.keys()))
        exit(1)

    instruct = presets[args.preset]
    print(f"プリセット: {args.preset}")
    print(f"テキスト: {args.text}")

    from mlx_audio.tts.utils import load_model
    from mlx_audio.tts.generate import generate_audio

    print("モデルを読み込み中...")
    model = load_model(MODEL_PATH)

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
        generated = Path(tmp_dir) / "output_000.wav"
        shutil.copy(generated, args.output)

    print(f"完了: {args.output}")

if __name__ == "__main__":
    main()
