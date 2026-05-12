import { useEffect, useRef, useState } from "react";

import AuthButton from "@/src/components/auth/AuthButton";
import { useConfirm } from "@/src/components/app/ConfirmProvider";
import StoreSection from "@/src/components/store/StoreSection";

const MAX_RECORDING_SECONDS = 25;

/**
 * @param {{ audioUrl?: string, isSubmitting: boolean, onUpload: (payload: { base64: string, filename: string }) => Promise<boolean>, onDelete: () => Promise<boolean> }} props
 */
export default function FounderWelcomeSection({
  audioUrl = "",
  isSubmitting,
  onUpload,
  onDelete,
}) {
  const { confirm } = useConfirm();
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const [isRecorderOpen, setIsRecorderOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recorderError, setRecorderError] = useState("");

  useEffect(
    () => () => {
      window.clearInterval(timerRef.current);
      if (recordedAudio?.url) {
        URL.revokeObjectURL(recordedAudio.url);
      }
    },
    [recordedAudio],
  );

  async function startRecording() {
    if (isRecording || typeof window === "undefined") {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setRecorderError("Audio recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedAudioMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      chunksRef.current = [];
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        if (recordedAudio?.url) {
          URL.revokeObjectURL(recordedAudio.url);
        }

        setRecordedAudio({
          blob,
          url: URL.createObjectURL(blob),
          filename: `welcome_voice.${getAudioExtension(blob.type)}`,
        });
        setIsRecording(false);
        window.clearInterval(timerRef.current);
      };

      setRecorderError("");
      setRecordingSeconds(0);
      setRecordedAudio(null);
      recorder.start();
      setIsRecording(true);
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((current) => {
          const nextValue = current + 1;
          if (nextValue >= MAX_RECORDING_SECONDS) {
            stopRecording();
          }
          return Math.min(nextValue, MAX_RECORDING_SECONDS);
        });
      }, 1000);
    } catch {
      setRecorderError("Microphone permission is required to record a welcome message.");
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }

  function resetRecording() {
    if (recordedAudio?.url) {
      URL.revokeObjectURL(recordedAudio.url);
    }

    setRecordedAudio(null);
    setRecordingSeconds(0);
    setRecorderError("");
  }

  async function uploadRecording() {
    if (!recordedAudio?.blob) {
      return;
    }

    const dataUrl = await blobToDataUrl(recordedAudio.blob);
    const success = await onUpload({
      base64: dataUrl.split(",")[1] || "",
      filename: recordedAudio.filename,
    });

    if (success) {
      resetRecording();
      setIsRecorderOpen(false);
    }
  }

  async function handleDelete() {
    const accepted = await confirm({
      title: "Delete Welcome Message",
      message: "This live founder welcome audio will be removed from your storefront.",
      confirmLabel: "Delete Audio",
    });

    if (!accepted) {
      return;
    }

    await onDelete();
  }

  return (
    <StoreSection
      title="Founder's Welcome Message"
      subtitle="Record a short store greeting that customers can play on your storefront."
    >
      <div className="space-y-5">
        {audioUrl ? (
          <div className="rounded-sm border border-white/10 bg-black/20 p-4">
            <div>
              <p className="text-sm font-bold text-brand-white">Live welcome message</p>
              <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <audio className="w-full" controls src={audioUrl}>
                  <track kind="captions" />
                </audio>
                <button
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-red-400/30 px-5 text-sm font-bold text-red-300 transition-colors hover:border-red-300 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleDelete}
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-sm border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/60">
            Add a short welcome message under 25 seconds from your founder or brand.
          </div>
        )}

        {!audioUrl ? (
          <div className="max-w-xs">
            <AuthButton
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsRecorderOpen(true)}
            >
              Record Founder Message
            </AuthButton>
          </div>
        ) : null}
      </div>

      {isRecorderOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4">
          <div className="w-full max-w-xl rounded-sm border border-white/10 bg-[#121212] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
                  Welcome Audio
                </p>
                <h2 className="mt-2 text-lg font-extrabold text-brand-white">
                  {isRecording
                    ? `Recording ${formatDuration(recordingSeconds)}`
                    : "Record your message"}
                </h2>
              </div>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 text-white/65 hover:border-white/20 hover:text-brand-white"
                type="button"
                onClick={() => {
                  if (isRecording) {
                    stopRecording();
                  }
                  setIsRecorderOpen(false);
                }}
              >
                x
              </button>
            </div>

            <div className="mt-5 rounded-sm border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-white/70">
                  Maximum recording time
                </span>
                <span className="text-sm font-bold text-brand-gold">
                  {MAX_RECORDING_SECONDS}s
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-brand-gold transition-all"
                  style={{
                    width: `${(recordingSeconds / MAX_RECORDING_SECONDS) * 100}%`,
                  }}
                />
              </div>
            </div>

            {recordedAudio?.url ? (
              <audio className="mt-5 w-full" controls src={recordedAudio.url}>
                <track kind="captions" />
              </audio>
            ) : null}

            {recorderError ? (
              <p className="mt-4 text-sm text-red-300">{recorderError}</p>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-3">
              {!isRecording && !recordedAudio ? (
                <button
                  className="rounded-sm border border-white/20 px-4 py-2 text-sm font-bold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
                  type="button"
                  onClick={startRecording}
                >
                  Record
                </button>
              ) : null}
              {isRecording ? (
                <button
                  className="rounded-sm border border-red-400/40 px-4 py-2 text-sm font-bold text-red-300 transition-colors hover:border-red-300 hover:text-red-100"
                  type="button"
                  onClick={stopRecording}
                >
                  Stop
                </button>
              ) : null}
              {!isRecording && recordedAudio ? (
                <>
                  <button
                    className="rounded-sm border border-white/20 px-4 py-2 text-sm font-bold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
                    type="button"
                    onClick={resetRecording}
                  >
                    Re-record
                  </button>
                  <button
                    className="rounded-sm border border-brand-gold/40 px-4 py-2 text-sm font-bold text-brand-gold transition-colors hover:border-brand-gold hover:text-brand-white disabled:cursor-not-allowed disabled:opacity-60"
                    type="button"
                    disabled={isSubmitting}
                    onClick={uploadRecording}
                  >
                    {isSubmitting ? "Uploading..." : "Submit"}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </StoreSection>
  );
}

function getSupportedAudioMimeType() {
  const options = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return options.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function getAudioExtension(mimeType) {
  if (String(mimeType).includes("mp4")) {
    return "mp4";
  }

  return "webm";
}

/**
 * @param {Blob} blob
 * @returns {Promise<string>}
 */
function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read audio recording"));
    reader.readAsDataURL(blob);
  });
}

function formatDuration(seconds) {
  return `00:${String(seconds).padStart(2, "0")}`;
}
