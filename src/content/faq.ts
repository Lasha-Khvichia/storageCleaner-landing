interface FaqItem {
  question: string;
  answer: string;
}

/** The single source for the FAQ section and its FAQPage JSON-LD. Facts only; never claim open source. */
export const FAQ: FaqItem[] = [
  {
    question: "Is storageCleaner free?",
    answer: "Yes. The download is free for Windows and Linux.",
  },
  {
    question: "What does storageCleaner delete?",
    answer:
      "Only what you confirm. It rates every file and folder Safe, Review, Unknown or Protected and gives a reason for each rating. Nothing is deleted until you approve it, and system folders are blocked.",
  },
  {
    question: "Can I undo a cleanup?",
    answer:
      "By default, yes. Deleted items go to the Recycle Bin or Trash, every cleanup is logged, and you can restore a whole cleanup from the app's history. Permanent delete, which asks you to type a confirmation phrase, cannot be undone.",
  },
  {
    question: "How is it different from Windows Disk Cleanup?",
    answer:
      "Disk Cleanup removes a fixed list of system files. storageCleaner scans whole drives, shows an interactive space map, the largest files and file types, and tells you why each item is safe or not to delete. It also runs on Linux.",
  },
  {
    question: "Which systems does it run on?",
    answer:
      "Windows 10 and 11 (64-bit, setup installer) and Linux (a .deb package for Ubuntu, Debian and Linux Mint, or an AppImage for any distribution).",
  },
];
