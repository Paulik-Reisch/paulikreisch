
"use client";

import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFirestore } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// TYPES
interface LyricLine {
  time: number;
  text: string;
}

const VIBES = [
  "Chipirón Selects",
  "Bavarian Beats",
  "Fiesta Latino",
  "Russian Lo-Fi",
  "Deep Tech",
  "Focus Flow"
];

const AdminDashboard: React.FC = () => {
  const firestore = useFirestore();
  const storage = getStorage();
  const { toast } = useToast();

  // STATE: META DATA
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('Los Chipirones');
  const [album, setAlbum] = useState('Unknown Album');
  const [duration, setDuration] = useState('0:00');
  const [vibe, setVibe] = useState(VIBES[0]);

  // STATE: FILES / URLS
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState('');
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState('');

  // STATE: LYRICS
  const [lyrics, setLyrics] = useState<LyricLine[]>([{ time: 0, text: "" }]);

  // STATE: UI
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Ready for new masterpiece.');

  // HELPERS
  const handleLyricChange = (index: number, field: keyof LyricLine, value: string | number) => {
    const newLyrics = [...lyrics];
    if (field === 'time') {
        newLyrics[index] = { ...newLyrics[index], [field]: Number(value) };
    } else {
        newLyrics[index] = { ...newLyrics[index], [field]: value };
    }
    setLyrics(newLyrics);
  };

  const addLyricLine = () => setLyrics([...lyrics, { time: 0, text: "" }]);
  const removeLyricLine = (index: number) => setLyrics(lyrics.filter((_, i) => i !== index));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'cover') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'audio') setAudioFile(e.target.files[0]);
      else setCoverFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
      setTitle('');
      setArtist('Los Chipirones');
      setAlbum('Unknown Album');
      setDuration('0:00');
      setVibe(VIBES[0]);
      setAudioFile(null);
      setAudioUrl('');
      setCoverFile(null);
      setCoverUrl('');
      setLyrics([{ time: 0, text: "" }]);
  }

  const handleUpload = async () => {
    if (!title) {
        toast({ variant: 'destructive', title: 'Fehler', description: 'Ein Track-Titel ist erforderlich.' });
        return;
    }
    setIsUploading(true);
    setStatusMsg('Initializing Upload Sequence...');

    try {
        let finalAudioUrl = audioUrl;
        if (audioFile) {
            setStatusMsg('Uploading audio file...');
            const audioRef = ref(storage, `tracks/${Date.now()}_${audioFile.name}`);
            await uploadBytes(audioRef, audioFile);
            finalAudioUrl = await getDownloadURL(audioRef);
        }

        let finalCoverUrl = coverUrl;
        if (coverFile) {
            setStatusMsg('Uploading cover art...');
            const coverRef = ref(storage, `covers/${Date.now()}_${coverFile.name}`);
            await uploadBytes(coverRef, coverFile);
            finalCoverUrl = await getDownloadURL(coverRef);
        }

        if (!finalAudioUrl || !finalCoverUrl) {
            throw new Error("Audio- oder Cover-URL fehlt. Bitte stellen Sie eine Datei oder eine URL bereit.");
        }
      
        setStatusMsg('Preparing database entry...');
        const trackData = {
            title,
            artist,
            album,
            duration,
            vibe,
            audioUrl: finalAudioUrl,
            imageUrl: finalCoverUrl,
            lyrics: lyrics.filter(l => l.text.trim() !== ''),
            createdAt: serverTimestamp()
        };

        setStatusMsg('Writing to Firestore...');
        await addDoc(collection(firestore, "CHIPIRONES/music/tracks"), trackData);

        toast({ title: 'Erfolg!', description: `Track "${title}" wurde erfolgreich veröffentlicht.` });
        setStatusMsg('Success! Track is live. 🐙');
        resetForm();
        setTimeout(() => setStatusMsg('Ready for new masterpiece.'), 3000);
      
    } catch (error: any) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Upload fehlgeschlagen', description: error.message });
        setStatusMsg(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
    <style>{`
        :root {
          --admin-bg: #050505;
          --panel-bg: #111111;
          --pink: #F46E7E;
          --pink-dim: rgba(244, 110, 126, 0.2);
          --border: rgba(255, 255, 255, 0.1);
          --text: #fff;
          --text-muted: #888;
        }

        .admin-wrapper {
          background: var(--admin-bg);
          min-height: 100vh;
          display: flex; justify-content: center; align-items: center;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          padding: 40px;
        }

        .admin-card {
          width: 100%; max-width: 800px;
          background: var(--panel-bg);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.8);
          position: relative; overflow: hidden;
        }

        .admin-header {
          display: flex; gap: 20px; align-items: center; margin-bottom: 40px; border-bottom: 1px solid var(--border); padding-bottom: 20px;
        }
        .logo-icon { font-size: 3rem; animation: float 6s ease-in-out infinite; }
        .admin-header h1 { margin: 0; font-size: 1.8rem; font-weight: 800; text-transform: uppercase; }
        .admin-header p { margin: 0; color: var(--pink); font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; }

        /* FORMS */
        .form-section { margin-bottom: 30px; }
        .input-group { margin-bottom: 20px; }

        label {
          display: block; font-size: 10px; font-weight: bold; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 8px; text-transform: uppercase;
        }

        .admin-input {
          width: 100%;
          background: rgba(0,0,0,0.3);
          border: 1px solid #333;
          color: white;
          padding: 15px;
          border-radius: 12px;
          font-size: 1rem;
          transition: 0.3s;
        }
        .admin-input:focus {
          border-color: var(--pink);
          box-shadow: 0 0 15px var(--pink-dim);
          outline: none;
        }
        .admin-input:disabled {
            background-color: #222;
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* MEDIA SPLIT */
        .split-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .media-box { background: rgba(255,255,255,0.03); padding: 20px; border-radius: 16px; border: 1px dashed #333; }
        .upload-btn {
          display: block; text-align: center; background: #333; color: white; padding: 10px; border-radius: 8px;
          cursor: pointer; font-size: 14px; font-weight: bold; transition: 0.2s;
        }
        .upload-btn:hover, .pink-btn:hover { background: var(--text); color: black; }
        .divider { text-align: center; font-size: 10px; color: #555; margin: 15px 0; }
        .admin-input.sm { padding: 10px; font-size: 0.8rem; }
        .file-badge { font-size: 0.8rem; background: var(--pink); color: white; padding: 5px 10px; border-radius: 20px; display: inline-flex; align-items: center; gap: 10px; }
        .file-badge span { cursor: pointer; font-weight: bold; }

        /* LYRICS */
        .lyrics-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .text-btn { background: none; border: none; color: var(--pink); cursor: pointer; font-size: 12px; text-transform: uppercase; font-weight: bold; }
        .lyric-row { display: grid; grid-template-columns: 80px 1fr 30px; gap: 10px; margin-bottom: 8px; }
        .time-input { text-align: center; }
        .del-btn { background: #222; border: none; color: #555; border-radius: 4px; cursor: pointer; transition: 0.2s; }
        .del-btn:hover { color: red; background: rgba(255,0,0,0.1); }

        /* CTA */
        .actions { display: flex; justify-content: space-between; align-items: center; margin-top: 50px; }
        .status { color: var(--pink); font-size: 14px; font-family: monospace; }
        .cta-btn {
          background: var(--pink); color: white; border: none; padding: 15px 50px; border-radius: 50px; 
          font-weight: 800; letter-spacing: 1px; font-size: 16px; cursor: pointer; transition: 0.3s;
          display: flex; align-items: center; gap: 10px;
        }
        .cta-btn:hover { transform: scale(1.05); box-shadow: 0 0 30px var(--pink); }
        .cta-btn:disabled { background: #444; cursor: not-allowed; opacity: 0.5; box-shadow: none; }
        .cta-btn.loading .loader { display: block; }

        /* Responsive */
        @media (max-width: 600px) { .split-grid { grid-template-columns: 1fr; } .admin-card { padding: 20px; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .fade-in { opacity: 0; transform: translateY(30px); animation: fadeInAnimation 0.8s ease-out forwards; }
        @keyframes fadeInAnimation { to { opacity: 1; transform: translateY(0); } }
    `}</style>
    <div className="admin-wrapper">
      <div className="admin-card fade-in">
        
        <header className="admin-header">
            <span className="logo-icon">🐙</span>
            <div>
                <h1>Mission Control</h1>
                <p>Upload New Masterpiece</p>
            </div>
        </header>

        {/* 1. META DATA SECTION */}
        <section className="form-section">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                 <div className="input-group">
                    <label>TRACK TITLE</label>
                    <input 
                        type="text" 
                        className="admin-input" 
                        placeholder="e.g. Electric Tentacles"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label>KÜNSTLER</label>
                    <input type="text" className="admin-input" value={artist} onChange={(e) => setArtist(e.target.value)} />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
                 <div className="input-group">
                    <label>ALBUM</label>
                    <input type="text" className="admin-input" value={album} onChange={(e) => setAlbum(e.target.value)} />
                </div>
                 <div className="input-group">
                    <label>DAUER (M:SS)</label>
                    <input type="text" className="admin-input" value={duration} onChange={(e) => setDuration(e.target.value)} />
                </div>
                 <div className="input-group">
                    <label>VIBE / CATEGORY</label>
                    <select className="admin-input" value={vibe} onChange={e => setVibe(e.target.value)}>
                        {VIBES.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
            </div>
        </section>

        {/* 2. MEDIA UPLOAD SECTION (SPLIT) */}
        <section className="form-section split-grid">
            <div className="media-box">
                <label>AUDIO SOURCE</label>
                <div className="upload-toggle">
                   {audioFile ? 
                     <div className="file-badge">🎵 {audioFile.name} <span onClick={() => setAudioFile(null)}>×</span></div> 
                     : 
                     <label className="upload-btn">
                        Upload MP3/WAV
                        <input type="file" accept="audio/*" hidden onChange={(e) => handleFileChange(e, 'audio')} />
                     </label>
                   }
                   <div className="divider">OR USE URL</div>
                   <input 
                     type="text" 
                     className="admin-input sm" 
                     placeholder="https://server.com/song.mp3" 
                     value={audioUrl}
                     onChange={(e) => setAudioUrl(e.target.value)}
                     disabled={!!audioFile}
                   />
                </div>
            </div>
            <div className="media-box">
                <label>COVER ART</label>
                <div className="upload-toggle">
                   {coverFile ? 
                     <div className="file-badge">🖼 {coverFile.name} <span onClick={() => setCoverFile(null)}>×</span></div> 
                     : 
                     <label className="upload-btn">
                        Upload PNG/JPG
                        <input type="file" accept="image/*" hidden onChange={(e) => handleFileChange(e, 'cover')} />
                     </label>
                   }
                   <div className="divider">OR USE URL</div>
                   <input 
                     type="text" 
                     className="admin-input sm" 
                     placeholder="https://img.com/cover.jpg" 
                     value={coverUrl}
                     onChange={(e) => setCoverUrl(e.target.value)}
                     disabled={!!coverFile}
                   />
                </div>
            </div>
        </section>

        {/* 3. LYRICS EDITOR */}
        <section className="form-section">
            <div className="lyrics-header">
                <label>SYNC LYRICS</label>
                <button type="button" className="text-btn" onClick={addLyricLine}>+ Add Line</button>
            </div>
            
            <div className="lyrics-editor max-h-40 overflow-y-auto pr-2">
                {lyrics.map((line, idx) => (
                    <div key={idx} className="lyric-row">
                        <input 
                            type="number" 
                            className="admin-input time-input" 
                            placeholder="Sec"
                            value={line.time} 
                            onChange={e => handleLyricChange(idx, 'time', e.target.value)}
                        />
                        <input 
                            type="text" 
                            className="admin-input text-input" 
                            placeholder="Lyrics text here..."
                            value={line.text}
                            onChange={e => handleLyricChange(idx, 'text', e.target.value)}
                        />
                        <button className="del-btn" onClick={() => removeLyricLine(idx)}>×</button>
                    </div>
                ))}
            </div>
        </section>

        {/* 4. ACTIONS */}
        <div className="actions">
            <div className="status">{statusMsg}</div>
            <button 
                className={`cta-btn ${isUploading ? 'loading' : ''}`} 
                onClick={handleUpload} 
                disabled={isUploading}
            >
                {isUploading && <Loader2 className="animate-spin" />}
                {isUploading ? 'UPLOADING...' : 'PUBLISH TRACK'}
            </button>
        </div>

      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
