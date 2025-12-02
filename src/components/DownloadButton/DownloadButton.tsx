"use client";

import styles from "./DownloadButton.module.scss"
import { DownloadButtonProps } from "../DTO/DTO"
export default function DownloadButton({
  filename,
  content,
  fileUrl,
  children
}: DownloadButtonProps) {

  const handleDownload = () => {
    let url: string;

    if (fileUrl) {
      // скачать файл из /public или внешнего URL
      url = fileUrl;
    }
    else if (content instanceof Blob) {
      url = URL.createObjectURL(content);
    }
    else if (typeof content === "string") {
      const blob = new Blob([content], { type: "text/plain" });
      url = URL.createObjectURL(blob);
    }
    else {
      console.error("DownloadButton: не передан ни fileUrl, ни content");
      return;
    }

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button type="button" onClick={handleDownload} className={styles.download}>
      {children || "Скачать"}
    </button>
  );
}