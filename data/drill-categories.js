// ============================================================
// Sound Drills content: pronunciation-error categories.
// Each category is either a minimal-pair set (`pairs`, e.g. "ship" vs
// "sheep") or a single-word set (`words`) with a breakdown + tip.
// `vnNote` explains *why* this is hard for a Vietnamese speaker.
// ============================================================

const DRILL_CATEGORIES = [
  {
    id: "final-consonants",
    title: "Final Consonant Sounds",
    vnNote: {
      en: "Vietnamese syllables rarely end in released consonants like /b/, /d/, /g/, /v/, /z/ — they get dropped or turned into a glottal stop. English listeners need to HEAR that final sound.",
      vi: "Trong tiếng Việt, âm cuối hiếm khi được bật rõ như /b/, /d/, /g/, /v/, /z/ — thường bị nuốt mất hoặc biến thành âm tắc thanh hầu. Người nghe tiếng Anh cần phải NGHE RÕ âm cuối đó.",
    },
    pairs: [
      { a: "back", b: "bag", tip: { en: "End 'back' with a sharp /k/, no air. End 'bag' with a soft /g/ — don't drop it.", vi: "Kết thúc 'back' bằng âm /k/ dứt khoát, không bật hơi. Kết thúc 'bag' bằng âm /g/ nhẹ — đừng bỏ mất âm này." } },
      { a: "cap", b: "cab", tip: { en: "Release the final /p/ in 'cap'. For 'cab', let the /b/ vibrate slightly — don't swallow it.", vi: "Bật rõ âm /p/ cuối trong 'cap'. Với 'cab', để âm /b/ rung nhẹ — đừng nuốt mất nó." } },
      { a: "rope", b: "robe", tip: { en: "'rope' ends crisp /p/, 'robe' ends with a soft, voiced /b/.", vi: "'rope' kết thúc bằng âm /p/ rõ ràng, 'robe' kết thúc bằng âm /b/ nhẹ và có rung thanh." } },
      { a: "leaf", b: "leave", tip: { en: "'leaf' = voiceless /f/ (just air). 'leave' = voiced /v/ (buzz your lips).", vi: "'leaf' = âm /f/ vô thanh (chỉ có hơi). 'leave' = âm /v/ có thanh (môi rung nhẹ)." } },
      { a: "hat", b: "had", tip: { en: "Don't drop the ending. 'hat' = sharp /t/, 'had' = soft /d/.", vi: "Đừng bỏ âm cuối. 'hat' = âm /t/ dứt khoát, 'had' = âm /d/ nhẹ." } },
      { a: "rich", b: "ridge", tip: { en: "'rich' ends with voiceless /tʃ/. 'ridge' ends with voiced /dʒ/ — let your throat buzz.", vi: "'rich' kết thúc bằng /tʃ/ vô thanh. 'ridge' kết thúc bằng /dʒ/ có thanh — để cổ họng rung nhẹ." } },
      { a: "wide", b: "white", tip: { en: "'wide' ends soft /d/, 'white' ends sharp /t/ — don't let both sound like a glottal stop.", vi: "'wide' kết thúc bằng /d/ nhẹ, 'white' kết thúc bằng /t/ dứt khoát — đừng để cả hai biến thành âm tắc họng." } },
      { a: "size", b: "sight", tip: { en: "'size' ends with a buzzing /z/. 'sight' ends with a crisp, silent /t/.", vi: "'size' kết thúc bằng âm /z/ rung. 'sight' kết thúc bằng âm /t/ gọn, không bật hơi." } },
    ],
  },
  {
    id: "consonant-clusters",
    title: "Consonant Clusters",
    vnNote: {
      en: "Vietnamese doesn't stack consonants at the end of a syllable. English words like 'asked' or 'texts' pile up 2-3 sounds — each one needs to be there, even if quick.",
      vi: "Tiếng Việt không ghép nhiều phụ âm liên tiếp ở cuối âm tiết. Các từ tiếng Anh như 'asked' hay 'texts' dồn 2-3 âm lại với nhau — mỗi âm đều cần xuất hiện, dù rất nhanh.",
    },
    words: [
      { word: "asked", breakdown: "a-sk-t", tip: { en: "Say all three sounds: /s/ /k/ /t/. Don't simplify to 'ast'.", vi: "Phát đủ cả ba âm: /s/ /k/ /t/. Đừng rút gọn thành 'ast'." } },
      { word: "desks", breakdown: "de-sk-s", tip: { en: "End with /sks/ — four consonant-ish sounds in a row. Slow down, don't drop the last /s/.", vi: "Kết thúc bằng /sks/ — bốn âm phụ âm liên tiếp. Nói chậm lại, đừng bỏ mất âm /s/ cuối." } },
      { word: "texts", breakdown: "te-ks-ts", tip: { en: "Common to drop to 'teks'. Push through to the final /ts/.", vi: "Thường bị rút gọn thành 'teks'. Hãy cố phát hết đến âm /ts/ cuối." } },
      { word: "world", breakdown: "wor-l-d", tip: { en: "Keep the /l/ before the /d/ — don't merge them into one sound.", vi: "Giữ âm /l/ trước âm /d/ — đừng trộn hai âm này thành một." } },
      { word: "months", breakdown: "mon-th-s", tip: { en: "The /θs/ cluster is hard — touch your tongue to your teeth, then add /s/.", vi: "Cụm âm /θs/ khá khó — chạm lưỡi vào răng, sau đó thêm âm /s/." } },
      { word: "fifths", breakdown: "fif-θ-s", tip: { en: "Two tricky sounds back to back: /θ/ then /s/. Slow it down, don't skip the /θ/.", vi: "Hai âm khó liên tiếp: /θ/ rồi /s/. Nói chậm lại, đừng bỏ qua âm /θ/." } },
      { word: "strengths", breakdown: "streng-th-s", tip: { en: "One of the hardest English words to say — five consonant sounds in a row at the end: /ŋkθs/.", vi: "Một trong những từ khó nói nhất tiếng Anh — năm âm phụ âm liên tiếp ở cuối: /ŋkθs/." } },
      { word: "glimpsed", breakdown: "glim-p-s-t", tip: { en: "Don't drop the /p/ before /s/ — Vietnamese speakers often skip straight to 'glimst'.", vi: "Đừng bỏ âm /p/ trước /s/ — người Việt thường nói tắt thành 'glimst'." } },
    ],
  },
  {
    id: "th-sounds",
    title: "TH Sounds (θ / ð)",
    vnNote: {
      en: "Vietnamese has no /θ/ or /ð/ sound, so these usually become /t/, /d/, or /s/. The fix: put your tongue tip lightly between your teeth and push air through.",
      vi: "Tiếng Việt không có âm /θ/ hay /ð/, nên thường bị thay bằng /t/, /d/, hoặc /s/. Cách sửa: đặt nhẹ đầu lưỡi giữa hai hàm răng và đẩy hơi ra.",
    },
    pairs: [
      { a: "think", b: "sink", tip: { en: "'think' needs tongue between teeth (/θ/). 'sink' is a normal /s/ — don't mix them up.", vi: "'think' cần lưỡi đặt giữa răng (/θ/). 'sink' là âm /s/ bình thường — đừng nhầm lẫn hai âm này." } },
      { a: "thin", b: "sin", tip: { en: "Same pair: tongue-between-teeth for 'thin', tongue-behind-teeth for 'sin'.", vi: "Tương tự: lưỡi giữa răng cho 'thin', lưỡi sau răng cho 'sin'." } },
      { a: "three", b: "tree", tip: { en: "'three' = tongue between teeth + air. 'tree' = tongue tip behind teeth, no air leak.", vi: "'three' = lưỡi giữa răng + đẩy hơi. 'tree' = đầu lưỡi sau răng, không thoát hơi." } },
      { a: "thank", b: "tank", tip: { en: "Don't let 'thank you' become 'tank you' — keep the tongue forward.", vi: "Đừng để 'thank you' biến thành 'tank you' — giữ lưỡi ở phía trước." } },
      { a: "mouth", b: "mouse", tip: { en: "'mouth' ends with /θ/ (tongue out). 'mouse' ends with /s/ (tongue in).", vi: "'mouth' kết thúc bằng /θ/ (lưỡi đưa ra). 'mouse' kết thúc bằng /s/ (lưỡi thu vào)." } },
      { a: "then", b: "den", tip: { en: "'then' uses the voiced /ð/ — tongue between teeth, with vocal buzz, not a plain /d/ like 'den'.", vi: "'then' dùng âm /ð/ có thanh — lưỡi giữa răng, có rung thanh, không phải /d/ thường như 'den'." } },
      { a: "bath", b: "bat", tip: { en: "'bath' ends with breathy /θ/ (tongue between teeth). 'bat' ends with a quick, dry /t/.", vi: "'bath' kết thúc bằng /θ/ có hơi (lưỡi giữa răng). 'bat' kết thúc bằng /t/ nhanh, gọn." } },
      { a: "with", b: "wit", tip: { en: "Don't let 'with' collapse into 'wit' — keep the soft /θ/ breath at the end.", vi: "Đừng để 'with' biến thành 'wit' — giữ hơi nhẹ /θ/ ở cuối." } },
    ],
  },
  {
    id: "r-vs-l",
    title: "R vs L",
    vnNote: {
      en: "Vietnamese R can be a flap or trill, very different from English /r/, which is a smooth glide with NO tongue contact. /l/ touches the tongue tip to the roof of the mouth.",
      vi: "Âm R trong tiếng Việt có thể là âm rung hoặc bật nhẹ, rất khác với /r/ tiếng Anh — vốn là âm lướt êm và lưỡi KHÔNG chạm vào đâu cả. Âm /l/ thì đầu lưỡi chạm vào vòm miệng.",
    },
    pairs: [
      { a: "right", b: "light", tip: { en: "For 'right', curl your tongue back, don't touch anything. For 'light', tap your tongue tip behind your top teeth.", vi: "Với 'right', cuộn lưỡi về sau, không chạm vào đâu. Với 'light', chạm đầu lưỡi vào sau răng trên." } },
      { a: "road", b: "load", tip: { en: "Same idea — /r/ = no contact, /l/ = tongue touches.", vi: "Tương tự — /r/ = lưỡi không chạm, /l/ = lưỡi có chạm." } },
      { a: "rice", b: "lice", tip: { en: "Round your lips slightly for /r/, smile slightly for /l/.", vi: "Hơi tròn môi khi phát /r/, hơi mỉm cười khi phát /l/." } },
      { a: "free", b: "flee", tip: { en: "Listen for the extra /l/ glide in 'flee' — your tongue taps mid-word.", vi: "Chú ý âm /l/ lướt thêm trong 'flee' — lưỡi chạm nhẹ ở giữa từ." } },
      { a: "correct", b: "collect", tip: { en: "Practice slowly: cor-RECT vs col-LECT.", vi: "Luyện chậm: cor-RECT và col-LECT." } },
      { a: "berry", b: "belly", tip: { en: "'berry' = tongue curls back mid-word for /r/. 'belly' = tongue taps the roof of the mouth for /l/.", vi: "'berry' = lưỡi cuộn về sau ở giữa từ cho /r/. 'belly' = lưỡi chạm vòm miệng cho /l/." } },
      { a: "wrong", b: "long", tip: { en: "'wrong' starts with /r/ — no tongue contact, slight lip rounding. 'long' starts with /l/ — tongue taps forward.", vi: "'wrong' bắt đầu bằng /r/ — lưỡi không chạm, hơi tròn môi. 'long' bắt đầu bằng /l/ — lưỡi chạm phía trước." } },
      { a: "arrive", b: "alive", tip: { en: "Both have a vowel before the consonant — focus on whether your tongue touches (l) or not (r).", vi: "Cả hai đều có nguyên âm trước phụ âm — chú ý lưỡi có chạm (l) hay không (r)." } },
    ],
  },
  {
    id: "s-sh-ch",
    title: "S vs SH vs CH",
    vnNote: {
      en: "Vietnamese 's', 'x', and 'ch/tr' map loosely onto English /s/, /ʃ/ (sh), and /tʃ/ (ch), but not exactly — mixing them up is one of the most common giveaways.",
      vi: "Âm 's', 'x', và 'ch/tr' trong tiếng Việt có phần giống với /s/, /ʃ/ (sh), và /tʃ/ (ch) trong tiếng Anh, nhưng không hoàn toàn giống — nhầm lẫn giữa các âm này là dấu hiệu rất thường gặp.",
    },
    pairs: [
      { a: "see", b: "she", tip: { en: "'see' = flat tongue, steady hiss /s/. 'she' = rounded lips, tongue pulled back /ʃ/.", vi: "'see' = lưỡi để bằng, phát âm /s/ đều như tiếng xì. 'she' = môi tròn, lưỡi kéo về sau, âm /ʃ/." } },
      { a: "sip", b: "ship", tip: { en: "Same contrast — keep /s/ thin and sharp, /ʃ/ wider and softer.", vi: "Tương tự — giữ /s/ mỏng và sắc, /ʃ/ rộng và mềm hơn." } },
      { a: "cheap", b: "sheep", tip: { en: "'cheap' starts with a stop+hiss /tʃ/ (like a sneeze). 'sheep' is just the hiss /ʃ/, no stop.", vi: "'cheap' bắt đầu bằng âm bật + xì /tʃ/ (giống tiếng hắt hơi). 'sheep' chỉ có tiếng xì /ʃ/, không có âm bật." } },
      { a: "chair", b: "share", tip: { en: "Notice the little 't' click at the start of 'chair' that 'share' doesn't have.", vi: "Chú ý tiếng bật 't' nhỏ ở đầu 'chair' mà 'share' không có." } },
      { a: "search", b: "church", tip: { en: "Both have /tʃ/ — practice the stop-release at the start and end.", vi: "Cả hai đều có /tʃ/ — luyện cách bật rồi thả âm ở đầu và cuối từ." } },
      { a: "show", b: "so", tip: { en: "'show' starts with rounded-lip /ʃ/. 'so' starts with a flat, thin /s/ — don't round your lips.", vi: "'show' bắt đầu bằng /ʃ/ với môi tròn. 'so' bắt đầu bằng /s/ mỏng, môi không tròn." } },
      { a: "wash", b: "watch", tip: { en: "'wash' ends with a soft hiss /ʃ/. 'watch' ends with a stop+hiss /tʃ/ — a little click before the hiss.", vi: "'wash' kết thúc bằng tiếng xì nhẹ /ʃ/. 'watch' kết thúc bằng âm bật + xì /tʃ/ — có tiếng bật nhỏ trước." } },
      { a: "badge", b: "batch", tip: { en: "'badge' ends with voiced /dʒ/ (like a soft 'j', throat buzzing). 'batch' ends with voiceless /tʃ/ — no buzz, just a puff.", vi: "'badge' kết thúc bằng âm /dʒ/ có thanh (giống âm 'j' nhẹ, cổ họng rung). 'batch' kết thúc bằng /tʃ/ vô thanh — không rung, chỉ có hơi." } },
    ],
  },
  {
    id: "vowel-length",
    title: "Vowel Length (short vs long)",
    vnNote: {
      en: "Vietnamese vowel length differences are subtle; English uses vowel length to distinguish entire words (ship vs sheep). Exaggerate the long vowels at first.",
      vi: "Sự khác biệt độ dài nguyên âm trong tiếng Việt khá tinh tế; tiếng Anh dùng độ dài nguyên âm để phân biệt hẳn hai từ khác nhau (ship và sheep). Lúc đầu nên kéo dài nguyên âm dài hơn mức bình thường để luyện.",
    },
    pairs: [
      { a: "ship", b: "sheep", tip: { en: "'ship' = short, relaxed /ɪ/. 'sheep' = long, tense /iː/ — stretch it out.", vi: "'ship' = âm /ɪ/ ngắn, thả lỏng. 'sheep' = âm /iː/ dài, căng — kéo dài âm này ra." } },
      { a: "full", b: "fool", tip: { en: "'full' is short and relaxed. 'fool' is long — round your lips and hold it.", vi: "'full' ngắn và thả lỏng. 'fool' dài hơn — tròn môi và giữ âm lâu hơn." } },
      { a: "sit", b: "seat", tip: { en: "Exaggerate 'seat' longer than feels natural at first.", vi: "Lúc đầu hãy kéo dài 'seat' hơn mức cảm thấy tự nhiên." } },
      { a: "pull", b: "pool", tip: { en: "Same short/long contrast as full/fool.", vi: "Giống cặp full/fool — ngắn và dài." } },
      { a: "hit", b: "heat", tip: { en: "Short relaxed /ɪ/ vs long tense /iː/.", vi: "/ɪ/ ngắn, thả lỏng so với /iː/ dài, căng." } },
      { a: "look", b: "Luke", tip: { en: "'look' = short relaxed /ʊ/. 'Luke' = long tense /uː/ — round your lips more and hold it.", vi: "'look' = âm /ʊ/ ngắn, thả lỏng. 'Luke' = âm /uː/ dài, căng — tròn môi hơn và giữ lâu hơn." } },
      { a: "cot", b: "caught", tip: { en: "'cot' = short open /ɑ/. 'caught' = longer, more rounded /ɔː/.", vi: "'cot' = âm /ɑ/ ngắn, mở. 'caught' = âm /ɔː/ dài hơn, tròn môi hơn." } },
      { a: "bit", b: "beat", tip: { en: "Keep practicing this short/long pair — it's one of the most common ways Vietnamese-accented English gets misheard.", vi: "Tiếp tục luyện cặp ngắn/dài này — đây là một trong những lý do phổ biến khiến giọng Việt nói tiếng Anh bị nghe nhầm." } },
    ],
  },
  {
    id: "endings",
    title: "-ed / -s Endings",
    vnNote: {
      en: "These grammar endings change sound depending on what comes before them. Vietnamese speakers often drop them entirely since there's no equivalent — but native listeners rely on hearing them.",
      vi: "Các đuôi ngữ pháp này thay đổi cách đọc tùy vào âm đứng trước. Người Việt thường bỏ hẳn các đuôi này vì tiếng Việt không có hiện tượng tương tự — nhưng người nghe bản ngữ lại dựa vào việc nghe được chúng để hiểu đúng nghĩa.",
    },
    words: [
      { word: "walked", breakdown: "walk-t (/t/ sound)", tip: { en: "After a voiceless sound like /k/, -ed sounds like /t/.", vi: "Sau âm vô thanh như /k/, đuôi -ed đọc giống /t/." } },
      { word: "played", breakdown: "play-d (/d/ sound)", tip: { en: "After a voiced sound like /eɪ/, -ed sounds like /d/.", vi: "Sau âm có thanh như /eɪ/, đuôi -ed đọc giống /d/." } },
      { word: "wanted", breakdown: "want-id (/ɪd/ sound)", tip: { en: "After /t/ or /d/, -ed adds a full extra syllable /ɪd/.", vi: "Sau /t/ hoặc /d/, đuôi -ed thêm hẳn một âm tiết /ɪd/." } },
      { word: "cats", breakdown: "cat-s (/s/ sound)", tip: { en: "After voiceless /t/, the plural -s stays /s/.", vi: "Sau âm vô thanh /t/, đuôi -s số nhiều vẫn đọc là /s/." } },
      { word: "dogs", breakdown: "dog-z (/z/ sound)", tip: { en: "After voiced /g/, the plural -s becomes /z/ — don't forget to voice it.", vi: "Sau âm có thanh /g/, đuôi -s số nhiều đọc thành /z/ — đừng quên rung thanh." } },
      { word: "houses", breakdown: "hou-zi-z (/ɪz/ sound)", tip: { en: "After a hissing sound like /s/, -es adds a whole extra syllable: /ɪz/.", vi: "Sau âm xì như /s/, đuôi -es thêm hẳn một âm tiết: /ɪz/." } },
      { word: "watches", breakdown: "wat-chi-z (/ɪz/ sound)", tip: { en: "Same rule as 'houses' — after /tʃ/, the -es ending becomes its own syllable.", vi: "Quy tắc giống 'houses' — sau /tʃ/, đuôi -es trở thành một âm tiết riêng." } },
      { word: "needed", breakdown: "nee-did (/ɪd/ sound)", tip: { en: "After /d/, -ed always adds the extra /ɪd/ syllable — never just a quick /d/.", vi: "Sau /d/, đuôi -ed luôn thêm âm tiết /ɪd/ — không bao giờ chỉ là một âm /d/ nhanh." } },
    ],
  },
  {
    id: "word-stress",
    title: "Word Stress",
    vnNote: {
      en: "Vietnamese is a tonal, mostly even-stress language. English meaning can change entirely with stress placement — and unstressed syllables get shorter and quieter ('schwa'), which feels unnatural at first.",
      vi: "Tiếng Việt là ngôn ngữ có thanh điệu và trọng âm khá đều giữa các âm tiết. Trong tiếng Anh, vị trí trọng âm có thể làm thay đổi hẳn nghĩa của từ — và các âm tiết không nhấn sẽ ngắn và nhẹ hơn (âm 'schwa'), điều này lúc đầu sẽ cảm thấy không tự nhiên.",
    },
    pairs: [
      { a: "PRESent (noun: a gift)", b: "preSENT (verb: to show)", tip: { en: "Stress the first syllable for the noun, second for the verb.", vi: "Nhấn âm tiết đầu khi là danh từ, nhấn âm tiết hai khi là động từ." } },
      { a: "REcord (noun)", b: "reCORD (verb)", tip: { en: "Same pattern — many English noun/verb pairs shift stress like this.", vi: "Mẫu hình tương tự — nhiều cặp danh từ/động từ trong tiếng Anh thay đổi trọng âm như vậy." } },
      { a: "PHOto", b: "phoTOGraphy", tip: { en: "Adding suffixes can move the stress entirely — listen for the new heavy syllable.", vi: "Thêm hậu tố có thể làm trọng âm chuyển hẳn sang vị trí khác — chú ý lắng nghe âm tiết được nhấn mới." } },
      { a: "COMfortable", b: "comFORtably", tip: { en: "Don't stress every syllable evenly — English flattens unstressed vowels to 'uh'.", vi: "Đừng nhấn đều tất cả các âm tiết — tiếng Anh làm nhẹ các nguyên âm không nhấn thành âm 'uh'." } },
      { a: "DEsert (noun: dry land)", b: "deSERT (verb: to abandon)", tip: { en: "Practice both meanings with the matching stress.", vi: "Luyện cả hai nghĩa với trọng âm tương ứng." } },
      { a: "obJECT (verb)", b: "OBject (noun)", tip: { en: "Verb stress is usually later in the word, noun stress is usually earlier — listen for the pattern.", vi: "Trọng âm động từ thường rơi vào âm tiết sau, trọng âm danh từ thường rơi vào âm tiết đầu — chú ý quy luật này." } },
      { a: "interesTING", b: "INteresting", tip: { en: "Natives often compress this to 3 syllables (IN-tres-ting) — don't pronounce every syllable evenly.", vi: "Người bản ngữ thường rút thành 3 âm tiết (IN-tres-ting) — đừng nhấn đều tất cả các âm tiết." } },
      { a: "neCESSary", b: "necesSARily", tip: { en: "Adding '-ily' shifts the stress one syllable to the right — very common in longer English words.", vi: "Thêm '-ily' làm trọng âm dịch sang một âm tiết bên phải — rất phổ biến trong các từ tiếng Anh dài." } },
    ],
  },
  {
    id: "n-vs-l",
    title: "N vs L",
    vnNote: {
      en: "This is one of the most documented Vietnamese-speaker issues — especially for people from Hanoi and the north, where /n/ and /l/ are merged in the local dialect. In English these are two completely separate sounds.",
      vi: "Đây là một trong những lỗi phổ biến nhất của người Việt — đặc biệt với người ở miền Bắc, nơi âm /n/ và /l/ thường bị lẫn trong phương ngữ địa phương. Trong tiếng Anh, đây là hai âm hoàn toàn khác nhau.",
    },
    pairs: [
      { a: "night", b: "light", tip: { en: "'night' = tongue tip touches just behind the top teeth, air goes through your nose. 'light' = tongue taps the roof of the mouth, air goes through your mouth.", vi: "'night' = đầu lưỡi chạm ngay sau răng trên, hơi thoát qua mũi. 'light' = lưỡi chạm vòm miệng, hơi thoát qua miệng." } },
      { a: "nine", b: "line", tip: { en: "Say 'night' and 'light' a few times first, then try this pair — same tongue-placement contrast.", vi: "Luyện 'night' và 'light' vài lần trước, rồi thử cặp này — vẫn là sự khác biệt về vị trí lưỡi." } },
      { a: "no", b: "low", tip: { en: "If these sound the same to you, that's the classic n/l merge — record yourself and listen back carefully.", vi: "Nếu hai từ này nghe giống nhau với bạn, đó chính là hiện tượng lẫn n/l điển hình — hãy ghi âm và nghe lại kỹ." } },
      { a: "name", b: "lame", tip: { en: "Nasal /n/ should feel like it's buzzing in your nose; /l/ should feel like it's only in your mouth.", vi: "Âm /n/ nên cảm thấy rung nhẹ trong mũi; âm /l/ thì chỉ cảm thấy trong miệng." } },
      { a: "net", b: "let", tip: { en: "Hold a finger lightly under your nose — you should feel air/vibration on 'net' but not on 'let'.", vi: "Đặt nhẹ ngón tay dưới mũi — bạn sẽ cảm thấy hơi/rung khi nói 'net' nhưng không cảm thấy khi nói 'let'." } },
      { a: "near", b: "leer", tip: { en: "Keep practicing minimal pairs daily — this contrast takes the most repetition to fix for many Vietnamese speakers.", vi: "Hãy luyện các cặp từ tối thiểu này hằng ngày — đây là lỗi cần luyện nhiều nhất với nhiều người Việt." } },
    ],
  },
  {
    id: "v-vs-w",
    title: "V vs W",
    vnNote: {
      en: "Vietnamese 'v' is closer to English /v/, but many learners substitute the easier /w/ glide for both, especially in casual speech. English /v/ needs your top teeth touching your bottom lip.",
      vi: "Âm 'v' trong tiếng Việt khá gần với /v/ tiếng Anh, nhưng nhiều người học lại thay cả hai bằng âm lướt /w/ dễ phát hơn, đặc biệt khi nói nhanh. Âm /v/ tiếng Anh cần răng trên chạm vào môi dưới.",
    },
    pairs: [
      { a: "vine", b: "wine", tip: { en: "'vine' = top teeth touch bottom lip, buzz. 'wine' = round your lips like blowing out a candle, no teeth contact.", vi: "'vine' = răng trên chạm môi dưới, có rung. 'wine' = tròn môi như thổi nến, không chạm răng." } },
      { a: "vet", b: "wet", tip: { en: "Look in a mirror — for 'vet' your top teeth should be visible touching your lower lip.", vi: "Soi gương — khi nói 'vet', răng trên của bạn nên chạm vào môi dưới, có thể thấy rõ." } },
      { a: "very", b: "wary", tip: { en: "Don't round your lips for 'very' — that's the /w/ habit sneaking in.", vi: "Đừng tròn môi khi nói 'very' — đó là thói quen của âm /w/ lẩn vào." } },
      { a: "vest", b: "west", tip: { en: "Practice slowly: teeth-on-lip for /v/, then relax into rounded lips for /w/.", vi: "Luyện chậm: răng chạm môi cho /v/, sau đó thả lỏng tròn môi cho /w/." } },
      { a: "vow", b: "wow", tip: { en: "'vow' = teeth touch lip, buzz. 'wow' = rounded lips only, no teeth contact — don't let 'vow' slide into 'wow'.", vi: "'vow' = răng chạm môi, có rung. 'wow' = chỉ tròn môi, không chạm răng — đừng để 'vow' biến thành 'wow'." } },
    ],
  },
  {
    id: "aspiration",
    title: "Aspirated P / T / K (word-initial)",
    vnNote: {
      en: "Vietnamese p/t/k at the start of a word are unaspirated (no extra puff of air). English p/t/k at the start of a stressed syllable need a strong puff of air, or 'pin' can sound like 'bin', 'top' like 'dop', 'cat' like 'gat' to native ears.",
      vi: "Âm p/t/k đầu từ trong tiếng Việt không bật hơi. Trong tiếng Anh, p/t/k ở đầu âm tiết có nhấn cần bật hơi mạnh, nếu không 'pin' sẽ nghe giống 'bin', 'top' giống 'dop', 'cat' giống 'gat' với người bản ngữ.",
    },
    pairs: [
      { a: "pin", b: "bin", tip: { en: "Hold a tissue in front of your mouth — it should visibly move on 'pin' (aspirated /p/) but stay still on 'bin'.", vi: "Cầm một tờ giấy mỏng trước miệng — giấy phải rung khi nói 'pin' (âm /p/ bật hơi) nhưng không rung khi nói 'bin'." } },
      { a: "ten", b: "den", tip: { en: "Say 'ten' with a strong burst of air right after the /t/, almost like a tiny explosion. 'den' has no burst at all.", vi: "Nói 'ten' với một luồng hơi mạnh ngay sau âm /t/, giống như một tiếng nổ nhỏ. 'den' thì hoàn toàn không có luồng hơi đó." } },
      { a: "come", b: "gum", tip: { en: "English /k/ at the start of a stressed word needs a sharp puff of air — Vietnamese 'c' doesn't have this. /g/ has no puff.", vi: "Âm /k/ tiếng Anh ở đầu từ có nhấn cần một luồng hơi mạnh — âm 'c' tiếng Việt không có đặc điểm này. Âm /g/ thì không có luồng hơi đó." } },
      { a: "pie", b: "buy", tip: { en: "Same tissue test — strong puff of air on 'pie', none on 'buy'.", vi: "Vẫn dùng phép thử tờ giấy — luồng hơi mạnh khi nói 'pie', không có khi nói 'buy'." } },
      { a: "tan", b: "Dan", tip: { en: "This is subtle but it's one reason Vietnamese-accented English can sound 'softer' than native English — aspiration adds clarity and emphasis.", vi: "Sự khác biệt này rất nhỏ nhưng là một lý do giọng Việt nói tiếng Anh nghe 'mềm' hơn — bật hơi giúp câu nói rõ và có điểm nhấn hơn." } },
    ],
  },
  {
    id: "z-sound",
    title: "Z Sound (voiced /z/)",
    vnNote: {
      en: "Vietnamese has no true /z/ sound, so English /z/ often gets replaced with /j/, /d/, or an unvoiced /s/. The fix is the same buzzing-throat feeling as /v/ — just with your tongue near your teeth instead of your lips.",
      vi: "Tiếng Việt không có âm /z/ thật, nên âm /z/ tiếng Anh thường bị thay bằng /j/, /d/, hoặc /s/ không rung. Cách sửa giống với /v/ — cảm giác rung ở họng, chỉ khác là lưỡi gần răng thay vì môi gần môi.",
    },
    pairs: [
      { a: "zoo", b: "Sue", tip: { en: "'zoo' should buzz in your throat the whole time you say the /z/. 'Sue' is just quiet air, no buzz.", vi: "Khi nói 'zoo', cổ họng nên rung suốt âm /z/. 'Sue' chỉ có hơi nhẹ, không rung." } },
      { a: "zip", b: "sip", tip: { en: "Touch your throat lightly — you should feel vibration on 'zip' but not on 'sip'.", vi: "Đặt nhẹ tay lên cổ họng — bạn sẽ cảm thấy rung khi nói 'zip' nhưng không rung khi nói 'sip'." } },
      { a: "lazy", b: "lacy", tip: { en: "The 'z' in the middle of 'lazy' still needs full voicing — don't let it fade into an /s/.", vi: "Âm 'z' ở giữa từ 'lazy' vẫn cần rung đầy đủ — đừng để nó nhạt thành /s/." } },
      { a: "buzz", b: "bus", tip: { en: "'buzz' literally describes the sound it should make — really let it buzz at the end.", vi: "'buzz' nghĩa là tiếng vo vo — hãy để âm cuối thực sự rung như vậy." } },
      { a: "please", b: "fleece", tip: { en: "Common polite word 'please' ends in /z/, not /s/ — getting this right makes requests sound much more natural.", vi: "Từ lịch sự thường dùng 'please' kết thúc bằng /z/, không phải /s/ — phát đúng âm này giúp câu nói tự nhiên hơn nhiều." } },
    ],
  },
  {
    id: "diphthongs",
    title: "Diphthongs (Gliding Vowels)",
    vnNote: {
      en: "Vietnamese vowels are mostly steady, single sounds. Many English vowels actually glide from one position to another within the same syllable (like /eɪ/ in 'day' or /oʊ/ in 'go'). Flattening these into one short sound is one of the most common ways Vietnamese-accented English gets noticed.",
      vi: "Nguyên âm tiếng Việt phần lớn là âm đơn, ổn định. Nhiều nguyên âm tiếng Anh thực ra lướt từ vị trí này sang vị trí khác trong cùng một âm tiết (như /eɪ/ trong 'day' hoặc /oʊ/ trong 'go'). Việc làm phẳng các âm này thành một âm ngắn là một trong những đặc điểm dễ nhận ra nhất của giọng Việt nói tiếng Anh.",
    },
    pairs: [
      { a: "day", b: "die", tip: { en: "'day' glides /eɪ/ (start mid, slide up). 'die' glides /aɪ/ (start low, slide up) — both need real movement, not a flat single vowel.", vi: "'day' lướt /eɪ/ (bắt đầu giữa, trượt lên). 'die' lướt /aɪ/ (bắt đầu thấp, trượt lên) — cả hai cần có chuyển động thật, không phải một nguyên âm phẳng." } },
      { a: "go", b: "guy", tip: { en: "'go' glides /oʊ/ with rounding lips. 'guy' glides /aɪ/ from a wide-open mouth — exaggerate the movement on both.", vi: "'go' lướt /oʊ/ với môi tròn dần. 'guy' lướt /aɪ/ từ miệng mở rộng — hãy phát âm hơi quá lên ở cả hai để cảm nhận chuyển động." } },
      { a: "time", b: "team", tip: { en: "'time' glides from low /a/ up to /ɪ/ — open your mouth wide at the start, then close it slightly. 'team' is a steady, single long /iː/ with no glide.", vi: "'time' lướt từ /a/ thấp lên /ɪ/ — mở miệng rộng lúc đầu, sau đó khép nhẹ lại. 'team' là một âm /iː/ dài, ổn định, không lướt." } },
      { a: "now", b: "new", tip: { en: "'now' glides /aʊ/ — round your lips at the very end. 'new' glides /juː/ — starts with a quick /j/ glide into a long /uː/.", vi: "'now' lướt /aʊ/ — tròn môi ở cuối từ. 'new' lướt /juː/ — bắt đầu bằng âm lướt /j/ nhanh rồi vào âm /uː/ dài." } },
      { a: "boy", b: "buy", tip: { en: "'boy' glides /ɔɪ/ from a rounded mouth. 'buy' glides /aɪ/ from a wide-open mouth — feel the different starting shape.", vi: "'boy' lướt /ɔɪ/ từ miệng tròn. 'buy' lướt /aɪ/ từ miệng mở rộng — cảm nhận hình miệng khác nhau lúc bắt đầu." } },
      { a: "phone", b: "fine", tip: { en: "Don't rush the vowel in either word — 'phone' needs the full /oʊ/ glide and 'fine' needs the full /aɪ/ glide to sound natural.", vi: "Đừng nói nhanh nguyên âm ở cả hai từ — 'phone' cần lướt đủ /oʊ/ và 'fine' cần lướt đủ /aɪ/ để nghe tự nhiên." } },
    ],
  },
  {
    id: "final-n-ng",
    title: "Final -N vs -NG",
    vnNote: {
      en: "Vietnamese has both final -n and -ng, but the English /ŋ/ (as in 'sing') is made entirely at the back of the tongue and throat — many learners accidentally swap it with the front-of-mouth /n/, or vice versa.",
      vi: "Tiếng Việt có cả âm cuối -n và -ng, nhưng âm /ŋ/ tiếng Anh (như trong 'sing') được phát hoàn toàn ở phía sau lưỡi và họng — nhiều người học vô tình đổi lẫn với âm /n/ phía trước miệng, hoặc ngược lại.",
    },
    pairs: [
      { a: "sin", b: "sing", tip: { en: "'sin' = tongue tip touches behind your top teeth. 'sing' = back of your tongue rises to touch the soft palate, no tongue-tip contact.", vi: "'sin' = đầu lưỡi chạm sau răng trên. 'sing' = phần sau lưỡi nâng lên chạm vòm miệng mềm, đầu lưỡi không chạm." } },
      { a: "ban", b: "bang", tip: { en: "Say 'bang' and freeze at the end — your tongue should be arched up at the back, mouth slightly open.", vi: "Nói 'bang' và giữ nguyên ở cuối — lưỡi nên cong lên ở phía sau, miệng hé mở." } },
      { a: "win", b: "wing", tip: { en: "Don't let 'wing' collapse into 'win' — the back-of-tongue contact for /ŋ/ is essential, not optional.", vi: "Đừng để 'wing' biến thành 'win' — lưỡi phải chạm phía sau cho âm /ŋ/, đây là bắt buộc, không phải tùy chọn." } },
      { a: "run", b: "rung", tip: { en: "Practice the word 'sing-along' slowly, isolating just the -ng ending each time.", vi: "Luyện từ 'sing-along' chậm, mỗi lần chỉ tập trung vào riêng đuôi -ng." } },
      { a: "thin", b: "thing", tip: { en: "These look similar in spelling but feel very different in the mouth — exaggerate the difference while practicing.", vi: "Hai từ này viết gần giống nhau nhưng cảm giác trong miệng rất khác — hãy phát âm hơi quá để cảm nhận sự khác biệt khi luyện." } },
    ],
  },
  {
    id: "silent-letters",
    title: "Silent Letters",
    vnNote: {
      en: "Vietnamese spelling is highly phonetic — almost every letter you write, you say. English spelling is not, and Vietnamese learners often pronounce silent letters because their instinct says every letter counts.",
      vi: "Chữ viết tiếng Việt rất sát với cách đọc — hầu như viết sao đọc vậy. Chữ viết tiếng Anh thì không như thế, và người Việt học tiếng Anh thường đọc luôn cả những chữ câm vì theo bản năng nghĩ rằng chữ nào cũng phải đọc.",
    },
    words: [
      { word: "knife", breakdown: "the 'k' is silent → sounds like 'nife'", tip: { en: "Don't pronounce the 'k' — it's there for historical spelling reasons only.", vi: "Đừng đọc chữ 'k' — nó chỉ còn lại do lý do lịch sử trong chính tả, không được đọc." } },
      { word: "comb", breakdown: "the 'b' is silent → sounds like 'kohm'", tip: { en: "Same family as 'climb', 'lamb', 'thumb' — the final 'b' after 'm' is always silent.", vi: "Cùng nhóm với 'climb', 'lamb', 'thumb' — chữ 'b' cuối sau 'm' luôn là chữ câm." } },
      { word: "island", breakdown: "the 's' is silent → sounds like 'eye-land'", tip: { en: "One of the trickiest — there's no /s/ sound here at all, despite the spelling.", vi: "Một trong những từ khó nhất — hoàn toàn không có âm /s/ ở đây, dù chính tả có chữ 's'." } },
      { word: "Wednesday", breakdown: "the first 'd' is silent → sounds like 'Wenz-day'", tip: { en: "Native speakers compress this word a lot — don't try to pronounce every syllable as written.", vi: "Người bản ngữ thường nói rút gọn từ này rất nhiều — đừng cố đọc đủ từng âm tiết như chữ viết." } },
      { word: "honest", breakdown: "the 'h' is silent → sounds like 'on-est'", tip: { en: "The 'h' here is silent, just like in 'hour' and 'heir' — don't add an /h/ breath at the start.", vi: "Chữ 'h' ở đây là chữ câm, giống như trong 'hour' và 'heir' — đừng bật hơi /h/ ở đầu từ." } },
      { word: "listen", breakdown: "the 't' is silent → sounds like 'lis-en'", tip: { en: "Adding the /t/ sound here is one of the most common Vietnamese-learner mistakes for this exact word.", vi: "Đọc thêm âm /t/ ở đây là một trong những lỗi phổ biến nhất của người Việt với chính từ này." } },
    ],
  },
  {
    id: "intonation",
    title: "Sentence Intonation (Question & Statement Tunes)",
    vnNote: {
      en: "Vietnamese is a tonal language — pitch changes the meaning of individual words. English uses pitch differently: it rises and falls across a whole sentence to signal questions, emotion, or emphasis, not to change a word's dictionary meaning. Carrying Vietnamese word-tones into English sentences can make speech sound flat or oddly emphasized to native listeners.",
      vi: "Tiếng Việt là ngôn ngữ có thanh điệu — cao độ làm thay đổi nghĩa của từng từ riêng lẻ. Tiếng Anh dùng cao độ theo cách khác: nó lên xuống xuyên suốt cả câu để báo hiệu câu hỏi, cảm xúc, hoặc sự nhấn mạnh, không phải để đổi nghĩa từ điển của từ. Mang thanh điệu tiếng Việt vào câu tiếng Anh có thể làm câu nói nghe phẳng hoặc nhấn sai chỗ với người nghe bản ngữ.",
    },
    words: [
      { word: "Are you coming?", breakdown: "↗ rising pitch at the very end", tip: { en: "Yes/no questions rise in pitch on the last word — let your voice climb noticeably on 'coming'.", vi: "Câu hỏi có/không lên cao độ ở từ cuối — để giọng lên rõ ràng ở từ 'coming'." } },
      { word: "Where are you going?", breakdown: "↘ falling pitch at the very end", tip: { en: "Wh-questions (who, what, where, why) usually fall in pitch at the end — the opposite of yes/no questions.", vi: "Câu hỏi có từ hỏi (who, what, where, why) thường xuống cao độ ở cuối — ngược lại với câu hỏi có/không." } },
      { word: "I had a great day.", breakdown: "↘ falling pitch — confident statement", tip: { en: "Plain statements fall at the end to sound complete and confident — a flat or rising tone here can sound unsure.", vi: "Câu khẳng định bình thường xuống cao độ ở cuối để nghe trọn vẹn và chắc chắn — nếu giữ phẳng hoặc lên cao ở đây sẽ nghe thiếu tự tin." } },
      { word: "Really?", breakdown: "↗ sharp rise — surprise", tip: { en: "Strong emotion (surprise, disbelief) pushes the pitch up high and fast — don't be afraid to exaggerate it.", vi: "Cảm xúc mạnh (ngạc nhiên, không tin) đẩy cao độ lên cao và nhanh — đừng ngại phát âm hơi quá lên." } },
      { word: "I said the blue one, not the red one.", breakdown: "extra pitch/emphasis on 'blue'", tip: { en: "English speakers raise pitch and volume on the one word being contrasted or corrected — practice picking out that word.", vi: "Người nói tiếng Anh thường tăng cao độ và âm lượng vào đúng từ đang được nhấn mạnh hoặc sửa lại — hãy luyện cách chọn đúng từ đó." } },
    ],
  },
];
