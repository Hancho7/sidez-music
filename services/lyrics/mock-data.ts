// services/lyrics/mock-data.ts

import type { TrackMetadata, TrackCredit, TrackLyrics, TrackCopyright, TrackPublishing, Language, CreditRole, LyricsStatus } from "./types";

const NOW = new Date().toISOString();

const BASE_TRACKS = [
  { id: "trk_1", name: "Midnight Bloom", artist: "Aura Keys", artistId: "a2" },
  { id: "trk_2", name: "Solar Drift", artist: "KXNG Nova", artistId: "a1" },
  { id: "trk_3", name: "Neon Veil", artist: "Luma Sol", artistId: "a4" },
  { id: "trk_4", name: "Static Rain", artist: "KXNG Nova", artistId: "a1" },
  { id: "trk_5", name: "Velvet Keys", artist: "Aura Keys", artistId: "a2" },
  { id: "trk_6", name: "Chrome Waves", artist: "Phasma", artistId: "a3" },
  { id: "trk_7", name: "Glass Horizon", artist: "KXNG Nova", artistId: "a1" },
  { id: "trk_8", name: "Fuego Nights", artist: "Luma Sol", artistId: "a4" },
];

const LYRICS_SAMPLES = [
  `[Verse 1]
  In the midnight hour, when shadows fall
  I hear your voice, a distant call
  Through the silence, through the rain
  I feel your presence, ease the pain

  [Chorus]
  Midnight bloom, in the dark you shine
  Lighting up this heart of mine
  Through the night, you guide me home
  In your love, I'm never alone

  [Verse 2]
  The city sleeps, but we're awake
  Every moment, for heaven's sake
  Your touch is fire, your love is gold
  A story that will never grow old`,

  `[Verse 1]
  Riding through the cosmos, no gravity
  Lost in space, just you and me
  Solar winds carry us away
  To a place where we can stay

  [Chorus]
  Solar drift, we're floating free
  Just the stars and you and me
  Through the galaxy so wide
  With you right by my side`,

  `[Verse 1]
  City lights, neon dreams
  Nothing's ever what it seems
  Underneath the electric sky
  We're alive, you and I

  [Chorus]
  Neon veil, hiding truth
  In the night, we find our youth
  Colors dancing in the dark
  Leaving our eternal mark`,
];

function createMockLyrics(index: number): TrackLyrics {
  const hasLyrics = index % 3 !== 0;
  const languages: Language[] = ["en", "es", "fr"];
  const language = languages[index % languages.length];

  return {
    id: `lyr_${index}`,
    trackId: `trk_${index + 1}`,
    language,
    lyrics: hasLyrics ? LYRICS_SAMPLES[index % LYRICS_SAMPLES.length] : "",
    // TrackLyrics.translatedLyrics is Partial<Record<Language, string>> — only
    // the keys that actually exist need to be provided.
    translatedLyrics: hasLyrics
      ? { es: "Translated lyrics in Spanish...", fr: "Translated lyrics in French..." }
      : {},
    wordCount: hasLyrics ? Math.floor(150 + Math.random() * 100) : 0,
    readingTime: hasLyrics ? Math.floor(1 + Math.random() * 3) : 0,
    isSynchronized: false,
  };
}

function createMockCredits(index: number): TrackCredit[] {
  const roles: CreditRole[] = ["WRITER", "PRODUCER", "COMPOSER", "MIX_ENGINEER", "MASTERING_ENGINEER"];
  const names = [
    "Marcus Williams", "Sarah Johnson", "Aaliyah Thompson",
    "James Park", "Sofia Reyes", "David Osei", "Luna Ray",
  ];

  return roles.slice(0, 2 + (index % 3)).map((role, i) => ({
    id: `cred_${index}_${i}`,
    trackId: `trk_${index + 1}`,
    role,
    personName: names[(index + i) % names.length],
    isPrimary: i === 0,
    royaltyShare: i === 0 ? 50 : 25,
  }));
}

function createMockCopyright(index: number): TrackCopyright {
  return {
    id: `copy_${index}`,
    trackId: `trk_${index + 1}`,
    copyrightOwner: `${BASE_TRACKS[index].artist}`,
    copyrightNotice: `© ${new Date().getFullYear()} ${BASE_TRACKS[index].artist}. All Rights Reserved.`,
    publishingRights: "Worldwide, all media",
    mechanicalRights: "Standard mechanical rights granted",
    territory: ["Worldwide"],
    publishingOrganization: `BMI / ASCAP`,
    isrc: `US-${String(100 + index).padStart(2, "0")}-${String(1000 + index).padStart(4, "0")}`,
    upc: `192641${String(1000 + index).padStart(4, "0")}${String(10 + index).padStart(2, "0")}`,
  };
}

function createMockPublishing(index: number): TrackPublishing {
  const date = new Date();
  date.setDate(date.getDate() - (30 + index * 7));

  return {
    id: `pub_${index}`,
    trackId: `trk_${index + 1}`,
    releaseDate: date.toISOString(),
    originalReleaseDate: date.toISOString(),
    isVisible: true,
    isExplicit: index % 3 === 0,
    isFeatured: index < 3,
    editorialNotes: "A powerful track blending modern production with classic songwriting.",
    previewStartTime: 30,
    previewDuration: 30,
  };
}

export const MOCK_METADATA: TrackMetadata[] = BASE_TRACKS.map((track, index) => {
  const hasLyrics = index % 3 !== 0;
  const statuses: LyricsStatus[] = ["COMPLETE", "PARTIAL", "PENDING", "NONE"];
  const status: LyricsStatus = hasLyrics ? statuses[index % 3] : "NONE";

  const updated = new Date(NOW);
  updated.setHours(updated.getHours() - (index * 3 + 2));

  const created = new Date(updated);
  created.setDate(created.getDate() - 30 - index * 5);

  return {
    id: `meta_${index + 1}`,
    trackId: track.id,
    trackName: track.name,
    artistName: track.artist,
    artistId: track.artistId,
    coverImage: `https://picsum.photos/seed/${track.id}/100/100`,

    lyrics: createMockLyrics(index),
    credits: createMockCredits(index),
    copyright: createMockCopyright(index),
    publishing: createMockPublishing(index),

    status,
    lastUpdated: updated.toISOString(),
    updatedBy: ["John Admin", "Sarah Editor", "Mike Manager"][index % 3],

    createdAt: created.toISOString(),
    updatedAt: updated.toISOString(),
    publishedAt: status === "COMPLETE" ? updated.toISOString() : null,
    archivedAt: null,
  };
});

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "it", label: "Italian" },
  { value: "nl", label: "Dutch" },
  { value: "ru", label: "Russian" },
];

export const CREDIT_ROLES: { value: CreditRole; label: string }[] = [
  { value: "WRITER", label: "Writer" },
  { value: "PRODUCER", label: "Producer" },
  { value: "COMPOSER", label: "Composer" },
  { value: "MIX_ENGINEER", label: "Mix Engineer" },
  { value: "MASTERING_ENGINEER", label: "Mastering Engineer" },
  { value: "PUBLISHER", label: "Publisher" },
  { value: "LABEL", label: "Label" },
  { value: "PERFORMER", label: "Performer" },
];

export const TERRITORIES = [
  "Worldwide", "North America", "Europe", "Asia", "South America",
  "Africa", "Australia", "UK", "US Only", "EU Only",
];
