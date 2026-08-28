/* =========================================================
   SKBT DIGITAL - JAVASCRIPT FINAL
   ========================================================= */


/* =========================================================
   URL GOOGLE APPS SCRIPT
   ========================================================= */

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxx4rP2GgaI2hGNdyZsp6pjdn-4q2OGukch5zCMVLP4SwKiGumKnwVp6FmVyQamVWcH/exec";


/* =========================================================
   VARIABEL
   ========================================================= */

let step = 1;

let death = false;

let isSubmitting = false;


/* =========================================================
   STATUS PENGIRIMAN
   postMessage tetap digunakan jika tersedia.
   iframe.onload menjadi fallback.
   ========================================================= */

let submissionState = {
  active: false,
  responseReceived: false,
  fallbackTimer: null,
  timeoutTimer: null,
  iframe: null
};


/* =========================================================
   DAFTAR DOKUMEN
   ========================================================= */

const basic = [

  [
    "Surat Pengantar dari Dinas",
    "suratPengantar"
  ],

  [
    "SK Terakhir",
    "skTerakhir"
  ],

  [
    "KTP",
    "ktp"
  ],

  [
    "Riwayat Jabatan",
    "riwayatJabatan"
  ]

];


const heirs = [

  [
    "KTP Ahli Waris",
    "ktpAhliWaris"
  ],

  [
    "Surat Keterangan Meninggal",
    "suratMeninggal"
  ],

  [
    "Surat Ahli Waris",
    "suratAhliWaris"
  ]

];


/* =========================================================
   MEMBUAT FORM UPLOAD
   ========================================================= */

function uploadHTML(items) {

  return items.map(function(item) {

    return `

      <div class="upload">

        <label>
          ${item[0]} *
        </label>

        <div class="drop">

          <span
            style="
              font-size:24px;
              color:#1457a6;
            "
          >
            ↑
          </span>

          <strong>
            Pilih file
          </strong>

          <small>
            PDF / JPG / PNG — maksimal 5 MB
          </small>

          <input
            type="file"
            id="${item[1]}"
            accept=".pdf,.jpg,.jpeg,.png"
            required
          >

          <div
            class="fname"
            id="${item[1]}Name"
          ></div>

        </div>

      </div>

    `;

  }).join("");

}


/* =========================================================
   PASANG DOKUMEN
   ========================================================= */

const docs =
  document.getElementById("docs");

if (docs) {

  docs.innerHTML =
    uploadHTML(basic);

}


const heirDocs =
  document.getElementById("heirDocs");

if (heirDocs) {

  heirDocs.innerHTML =
    uploadHTML(heirs);

}


/* =========================================================
   PILIH KEPERLUAN
   ========================================================= */

const keperluan =
  document.getElementById("keperluan");


if (keperluan) {

  keperluan.addEventListener(
    "change",
    function() {

      death =
        this.value ===
        "Pemberhentian dengan hormat sebagai Pegawai Negeri Sipil (PNS) karena meninggal dunia";


      const heirSection =
        document.getElementById(
          "heirSection"
        );


      if (heirSection) {

        heirSection.classList.toggle(
          "show",
          death
        );

      }


      heirs.forEach(
        function(item) {

          const input =
            document.getElementById(
              item[1]
            );


          if (input) {

            input.required =
              death;

          }

        }
      );

    }
  );

}


/* =========================================================
   VALIDASI FILE
   ========================================================= */

document.addEventListener(
  "change",
  function(event) {

    if (
      event.target.type !==
      "file"
    ) {

      return;

    }


    const input =
      event.target;

    const file =
      input.files[0];


    if (!file) {

      return;

    }


    const output =
      document.getElementById(
        input.id + "Name"
      );


    /* -----------------------------------------------------
       MAKSIMUM 5 MB
       ----------------------------------------------------- */

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      alert(
        "Ukuran file maksimal 5 MB."
      );


      input.value = "";


      if (output) {

        output.textContent =
          "";

      }


      return;

    }


    /* -----------------------------------------------------
       FORMAT
       ----------------------------------------------------- */

    const allowed = [

      "application/pdf",

      "image/jpeg",

      "image/png"

    ];


    if (
      !allowed.includes(
        file.type
      )
    ) {

      alert(
        "Format file harus PDF, JPG, atau PNG."
      );


      input.value = "";


      if (output) {

        output.textContent =
          "";

      }


      return;

    }


    if (output) {

      output.textContent =
        "✓ " + file.name;

    }

  }
);


/* =========================================================
   VALIDASI STEP
   ========================================================= */

function valid(stepNumber) {

  const section =
    document.getElementById(
      "s" + stepNumber
    );


  if (!section) {

    return true;

  }


  const inputs =
    section.querySelectorAll(
      "input, select, textarea"
    );


  for (
    const input of inputs
  ) {

    if (
      input.offsetParent !== null &&
      !input.checkValidity()
    ) {

      input.reportValidity();

      input.focus();

      return false;

    }

  }


  return true;

}


/* =========================================================
   NEXT
   ========================================================= */

function next() {

  if (step === 1) {

    if (!valid(1)) {

      return;

    }


    step = 2;

  }

  else if (step === 2) {

    if (!valid(2)) {

      return;

    }


    step = 3;

  }


  show();

}


/* =========================================================
   PREVIOUS
   ========================================================= */

function prev() {

  if (step > 1) {

    step--;

  }


  show();

}


/* =========================================================
   TAMPILKAN STEP
   ========================================================= */

function show() {

  document
    .querySelectorAll(".step")
    .forEach(
      function(section) {

        section.classList.remove(
          "active"
        );

      }
    );


  const current =
    document.getElementById(
      "s" + step
    );


  if (current) {

    current.classList.add(
      "active"
    );

  }


  for (
    let i = 1;
    i <= 3;
    i++
  ) {

    const progress =
      document.getElementById(
        "p" + i
      );


    if (progress) {

      progress.classList.toggle(
        "active",
        i === step
      );


      progress.classList.toggle(
        "done",
        i < step
      );

    }

  }


  const l1 =
    document.getElementById(
      "l1"
    );


  const l2 =
    document.getElementById(
      "l2"
    );


  if (l1) {

    l1.classList.toggle(
      "on",
      step >= 2
    );

  }


  if (l2) {

    l2.classList.toggle(
      "on",
      step >= 3
    );

  }


  if (step === 3) {

    review();

  }


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


/* =========================================================
   MENGAMBIL NILAI
   ========================================================= */

function val(id) {

  const element =
    document.getElementById(
      id
    );


  return element
    ? element.value.trim()
    : "";

}


/* =========================================================
   REVIEW
   ========================================================= */

function review() {

  const data = [

    [
      "Keperluan",
      "keperluan"
    ],

    [
      "Nama Sesuai SK",
      "nama"
    ],

    [
      "NIP",
      "nip"
    ],

    [
      "Pangkat/Golongan",
      "pangkat"
    ],

    [
      "Jabatan",
      "jabatan"
    ],

    [
      "Instansi",
      "instansi"
    ],

    [
      "Unit Kerja",
      "unit"
    ],

    [
      "Nomor WhatsApp",
      "wa"
    ],

    [
      "Email",
      "email"
    ]

  ];


  const reviewBox =
    document.getElementById(
      "review"
    );


  if (reviewBox) {

    reviewBox.innerHTML =

      data.map(
        function(item) {

          return `

            <div class="row">

              <span>
                ${item[0]}
              </span>

              <b>
                ${escapeHTML(
                  val(item[1])
                )}
              </b>

            </div>

          `;

        }
      ).join("");

  }


  const allDocuments =
    death
      ? basic.concat(heirs)
      : basic;


  const reviewDocs =
    document.getElementById(
      "reviewDocs"
    );


  if (reviewDocs) {

    reviewDocs.innerHTML =

      allDocuments.map(
        function(item) {

          const input =
            document.getElementById(
              item[1]
            );


          const file =
            input &&
            input.files &&
            input.files.length
              ? input.files[0]
              : null;


          return `

            <li>

              ✓ ${item[0]}:

              ${
                file
                  ? escapeHTML(
                      file.name
                    )
                  : "-"
              }

            </li>

          `;

        }
      ).join("");

  }

}


/* =========================================================
   FILE -> BASE64
   ========================================================= */

function fileToBase64(file) {

  return new Promise(
    function(resolve, reject) {

      const reader =
        new FileReader();


      reader.onload =
        function() {

          const result =
            reader.result;


          const base64 =
            result.split(",")[1];


          resolve(base64);

        };


      reader.onerror =
        function(error) {

          reject(error);

        };


      reader.readAsDataURL(
        file
      );

    }
  );

}


/* =========================================================
   KUMPULKAN FILE
   ========================================================= */

async function collectFiles() {

  const allDocuments =
    death
      ? basic.concat(heirs)
      : basic;


  const files = {};


  for (
    const item of allDocuments
  ) {

    const input =
      document.getElementById(
        item[1]
      );


    if (
      !input ||
      !input.files ||
      !input.files.length
    ) {

      continue;

    }


    const file =
      input.files[0];


    files[item[1]] = {

      name:
        file.name,

      mimeType:
        file.type,

      size:
        file.size,

      data:
        await fileToBase64(
          file
        )

    };

  }


  return files;

}


/* =========================================================
   SUBMIT KE GOOGLE APPS SCRIPT
   ========================================================= */

async function submitToGoogle() {

  if (
    !GOOGLE_SCRIPT_URL ||
    GOOGLE_SCRIPT_URL.includes(
      "GANTI_DENGAN"
    )
  ) {

    throw new Error(
      "URL Google Apps Script belum dipasang."
    );

  }


  if (
    !GOOGLE_SCRIPT_URL.endsWith(
      "/exec"
    )
  ) {

    throw new Error(
      "URL Web App harus berakhiran /exec."
    );

  }


  /* =====================================================
     BUAT TRANSACTION ID
     ===================================================== */

  const transactionId =
    "TX-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .substring(2, 8);


  console.log(
    "[SKBT] Transaction ID:",
    transactionId
  );


  /* =====================================================
     KUMPULKAN FILE
     ===================================================== */

  const files =
    await collectFiles();


  /* =====================================================
     DATA
     ===================================================== */

  const payload = {

    action:
      "submit",

    transactionId:
      transactionId,

    keperluan:
      val("keperluan"),

    nama:
      val("nama"),

    nip:
      val("nip"),

    pangkat:
      val("pangkat"),

    jabatan:
      val("jabatan"),

    instansi:
      val("instansi"),

    unit:
      val("unit"),

    wa:
      val("wa"),

    email:
      val("email"),

    files:
      JSON.stringify(files)

  };


  /* =====================================================
     IFRAME SUBMIT
     ===================================================== */

  let iframe =
    document.getElementById(
      "submitFrame"
    );


  if (!iframe) {

    iframe =
      document.createElement(
        "iframe"
      );

    iframe.id =
      "submitFrame";

    iframe.name =
      "submitFrame";

    iframe.style.display =
      "none";

    document.body.appendChild(
      iframe
    );

  }


  /* =====================================================
     FORM POST
     ===================================================== */

  const postForm =
    document.createElement(
      "form"
    );


  postForm.method =
    "POST";

  postForm.action =
    GOOGLE_SCRIPT_URL;

  postForm.target =
    "submitFrame";

  postForm.style.display =
    "none";


  Object.keys(payload)
    .forEach(
      function(key) {

        const input =
          document.createElement(
            "input"
          );

        input.type =
          "hidden";

        input.name =
          key;

        input.value =
          payload[key];

        postForm.appendChild(
          input
        );

      }
    );


  document.body.appendChild(
    postForm
  );


  console.log(
    "[SKBT] Mengirim data..."
  );


  postForm.submit();


  setTimeout(
    function() {

      if (
        postForm.parentNode
      ) {

        postForm.parentNode.removeChild(
          postForm
        );

      }

    },
    1000
  );


  /* =====================================================
     POLLING
     Tidak menunggu postMessage.
     ===================================================== */

  await waitForApplicationNumber(
    transactionId
  );

}


/* =========================================================
   KUNCI TOMBOL SUBMIT
   ========================================================= */

function lockSubmitButton() {

  const button =
    document.getElementById(
      "submitBtn"
    );


  if (!button) {

    return;

  }


  button.disabled =
    true;


  button.style.pointerEvents =
    "none";


  button.style.opacity =
    "0.6";


  button.style.cursor =
    "not-allowed";


  button.innerHTML =
    "⏳ Mengirim...";

}


/* =========================================================
   BUKA KEMBALI TOMBOL
   HANYA JIKA ERROR
   ========================================================= */

function resetSubmitButton() {

  const button =
    document.getElementById(
      "submitBtn"
    );


  if (!button) {

    return;

  }


  button.disabled =
    false;


  button.style.pointerEvents =
    "";


  button.style.opacity =
    "";


  button.style.cursor =
    "";


  button.innerHTML =
    "✓ Kirim Permohonan";


  isSubmitting =
    false;

}


/* =========================================================
   LOADING
   ========================================================= */

function showSubmitLoading() {

  const button =
    document.getElementById(
      "submitBtn"
    );


  const loading =
    document.getElementById(
      "submitLoading"
    );


  const loadingText =
    document.getElementById(
      "loadingText"
    );


  if (button) {

    button.disabled =
      true;


    button.style.pointerEvents =
      "none";


    button.style.opacity =
      "0.7";


    button.style.cursor =
      "not-allowed";


    button.innerHTML =
      "⏳ Mengirim...";

  }


  if (loading) {

    loading.classList.add(
      "active"
    );

  }


  if (loadingText) {

    loadingText.textContent =
      "Mengirim permohonan...";

  }

}


/* =========================================================
   SEMBUNYIKAN LOADING
   ========================================================= */

function hideSubmitLoading() {

  const loading =
    document.getElementById(
      "submitLoading"
    );


  if (loading) {

    loading.classList.remove(
      "active"
    );

  }

}


/* =========================================================
   RESPONSE DARI GOOGLE APPS SCRIPT
   ========================================================= */

window.addEventListener(

  "message",

  function(event) {

    console.log(
      "[SKBT] Pesan diterima:",
      event.data
    );


    const message =
      event.data;


    if (
      !message ||
      message.type !==
        "SKBT_RESPONSE"
    ) {

      return;

    }


    const data =
      message.data;


    if (!data) {

      return;

    }


    submissionState.responseReceived =
      true;


    submissionState.active =
      false;


    if (
      submissionState.fallbackTimer
    ) {

      clearTimeout(
        submissionState.fallbackTimer
      );

    }


    if (
      submissionState.timeoutTimer
    ) {

      clearTimeout(
        submissionState.timeoutTimer
      );

    }


    handleSubmissionResponse(
      data
    );

  },

  false

);


/* =========================================================
   PROSES RESPONSE TERPUSAT
   ========================================================= */

function handleSubmissionResponse(
  data
) {

  hideSubmitLoading();


  /* -------------------------------------------------------
     JIKA GAGAL
     ------------------------------------------------------- */

  if (
    data.success === false
  ) {

    resetSubmitButton();


    alert(
      data.message ||
      "Permohonan gagal diproses."
    );


    return;

  }


  /* -------------------------------------------------------
     NOMOR PERMOHONAN
     ------------------------------------------------------- */

  const number =
    document.getElementById(
      "number"
    );


  if (number) {

    number.textContent =
      data.nomor ||
      "-";

  }


  showSuccessScreen();

}


/* =========================================================
   FALLBACK JIKA postMessage TIDAK SAMPAI

   Browser tidak mengizinkan parent membaca isi iframe
   Google Apps Script yang berbeda origin.

   Oleh karena itu fallback ini hanya digunakan setelah
   iframe response selesai dimuat.

   Nomor permohonan tidak dapat dibaca melalui fallback.
   ========================================================= */

function showSuccessFallback() {

  if (
    !submissionState.active
  ) {

    return;

  }


  submissionState.active =
    false;


  if (
    submissionState.timeoutTimer
  ) {

    clearTimeout(
      submissionState.timeoutTimer
    );

  }


  console.warn(
    "[SKBT] Menggunakan fallback iframe."
  );


  const number =
    document.getElementById(
      "number"
    );


  if (number) {

    number.textContent =
      "Berhasil diproses";

  }


  showSuccessScreen();

}


/* =========================================================
   TAMPILKAN HALAMAN SUKSES
   ========================================================= */

function showSuccessScreen() {

  const form =
    document.getElementById(
      "form"
    );


  if (form) {

    form.style.display =
      "none";

  }


  const progress =
    document.querySelector(
      ".progress"
    );


  if (progress) {

    progress.style.display =
      "none";

  }


  const success =
    document.getElementById(
      "success"
    );


  if (success) {

    success.classList.add(
      "show"
    );

  }


  hideSubmitLoading();


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


/* =========================================================
   SUBMIT FORM
   ========================================================= */

const mainForm =
  document.getElementById(
    "form"
  );


if (mainForm) {

  mainForm.addEventListener(

    "submit",

    async function(event) {

      event.preventDefault();


      /* =================================================
         CEGAH DOUBLE CLICK
         ================================================= */

      if (isSubmitting) {

        console.log(
          "Submit diabaikan karena proses sedang berjalan."
        );

        return;

      }


      /* =================================================
         CHECKLIST FINAL
         ================================================= */

      const final =
        document.getElementById(
          "final"
        );


      if (
        !final ||
        !final.checked
      ) {

        alert(
          "Centang checklist konfirmasi terlebih dahulu."
        );

        return;

      }


      /* =================================================
         VALIDASI STEP 1
         ================================================= */

      if (!valid(1)) {

        step = 1;

        show();

        return;

      }


      /* =================================================
         VALIDASI STEP 2
         ================================================= */

      if (!valid(2)) {

        step = 2;

        show();

        return;

      }


      /* =================================================
         SEMUA VALIDASI BERHASIL
         ================================================= */

      isSubmitting =
        true;


      /* =================================================
         KUNCI TOMBOL
         ================================================= */

      lockSubmitButton();


      /* =================================================
         TAMPILKAN LOADING
         ================================================= */

      showSubmitLoading();


      /* =================================================
         KIRIM
         ================================================= */

      try {

        await submitToGoogle();

      }

      catch (error) {

        console.error(
          "ERROR SUBMIT:",
          error
        );


        submissionState.active =
          false;


        hideSubmitLoading();


        resetSubmitButton();


        alert(

          error &&
          error.message

            ? error.message

            : "Terjadi kesalahan saat mengirim permohonan."

        );

      }

    }

  );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

  return String(value)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   MEMBACA DATA DARI CHATBOT
   ========================================================= */

function loadChatbotData() {

  try {

    /*
     * Ambil fragment dari URL
     *
     * Contoh:
     *
     * #chatdata=%7B%22nama%22...
     */

    const hash =
      window.location.hash;


    if (
      !hash ||
      !hash.startsWith(
        "#chatdata="
      )
    ) {

      return;

    }


    /*
     * Ambil data setelah #chatdata=
     */

    const encoded =
      hash.substring(
        "#chatdata=".length
      );


    /*
     * Decode
     */

    const json =
      decodeURIComponent(
        encoded
      );


    /*
     * Ubah kembali menjadi object
     */

    const data =
      JSON.parse(
        json
      );


    console.log(
      "DATA DARI CHATBOT:",
      data
    );


    /*
     * Isi form
     */

    setFieldValue(
      "keperluan",
      data.keperluan
    );


    setFieldValue(
      "nama",
      data.nama
    );


    setFieldValue(
      "nip",
      data.nip
    );


    setFieldValue(
      "pangkat",
      data.pangkat
    );


    setFieldValue(
      "jabatan",
      data.jabatan
    );


    setFieldValue(
      "instansi",
      data.instansi
    );


    setFieldValue(
      "unit",
      data.unit
    );


    setFieldValue(
      "wa",
      data.wa
    );


    setFieldValue(
      "email",
      data.email
    );


    /*
     * Trigger perubahan keperluan
     */

    const keperluan =
      document.getElementById(
        "keperluan"
      );


    if (keperluan) {

      keperluan.dispatchEvent(

        new Event(
          "change",
          {
            bubbles: true
          }
        )

      );

    }


    /*
     * Hapus data dari URL
     */

    history.replaceState(

      null,

      "",

      window.location.pathname +
      window.location.search

    );


    /*
     * Beri informasi kepada pemohon
     */

    showChatbotNotice();

  }

  catch(error) {

    console.error(
      "GAGAL MEMBACA DATA CHATBOT:",
      error
    );

  }

}


/* =========================================================
   ISI FIELD
   ========================================================= */

function setFieldValue(
  id,
  value
) {

  const element =
    document.getElementById(
      id
    );


  if (!element) {

    console.warn(
      "Field tidak ditemukan:",
      id
    );

    return;

  }


  element.value =
    value || "";


  /*
   * Trigger input
   */

  element.dispatchEvent(

    new Event(
      "input",
      {
        bubbles: true
      }
    )

  );


  /*
   * Trigger change
   */

  element.dispatchEvent(

    new Event(
      "change",
      {
        bubbles: true
      }
    )

  );

}


/* =========================================================
   NOTIFIKASI DATA CHATBOT
   ========================================================= */

function showChatbotNotice() {

  /*
   * Jangan membuat elemen jika
   * sudah ada.
   */

  if (
    document.getElementById(
      "chatbotNotice"
    )
  ) {

    return;

  }


  const notice =
    document.createElement(
      "div"
    );


  notice.id =
    "chatbotNotice";


  notice.style.cssText = `

    background:#e8f5e9;

    border:1px solid #81c784;

    color:#1b5e20;

    padding:14px 16px;

    margin:15px 0;

    border-radius:10px;

    font-size:14px;

    line-height:1.5;

  `;


  notice.innerHTML = `

    <strong>
      🤖 Data dari Asisten SKBT
    </strong>

    <br>

    Data pemohon telah diisi otomatis dari percakapan
    dengan Asisten SKBT Digital.

    Silakan periksa kembali data sebelum melanjutkan.

  `;


  /*
   * Letakkan di awal form
   */

  const form =
    document.getElementById(
      "form"
    );


  if (form) {

    form.prepend(
      notice
    );

  }

}


/* =========================================================
   JALANKAN SAAT HALAMAN SELESAI DIMUAT
   ========================================================= */

document.addEventListener(

  "DOMContentLoaded",

  function() {

    loadChatbotData();

  }

);
