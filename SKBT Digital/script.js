/* =========================================================
   SKBT DIGITAL - SCRIPT.JS FINAL
   ========================================================= */


/* =========================================================
   GOOGLE APPS SCRIPT
   ========================================================= */

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxx4rP2GgaI2hGNdyZsp6pjdn-4q2OGukch5zCMVLP4SwKiGumKnwVp6FmVyQamVWcH/exec";


/* =========================================================
   VARIABEL GLOBAL
   ========================================================= */

let step = 1;

let death = false;

let isSubmitting = false;

let currentTransactionId = "";

let pollingTimer = null;

let pollingAttempts = 0;

let responseReceived = false;




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
   HTML UPLOAD
   ========================================================= */

function uploadHTML(items) {

  return items.map(function(item) {

    return `

      <div class="upload">

        <label>
          ${escapeHTML(item[0])} *
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
      !event.target ||
      event.target.type !== "file"
    ) {

      return;

    }


    const input =
      event.target;


    const file =
      input.files &&
      input.files[0];


    if (!file) {

      return;

    }


    const output =
      document.getElementById(
        input.id + "Name"
      );


    /* -----------------------------------------------------
       MAKSIMAL 5 MB
       ----------------------------------------------------- */

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      alert(
        "Ukuran file maksimal 5 MB."
      );


      input.value =
        "";


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


      input.value =
        "";


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
    document.getElementById("l1");


  const l2 =
    document.getElementById("l2");


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
   AMBIL NILAI FORM
   ========================================================= */

function val(id) {

  const element =
    document.getElementById(id);


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

              ✓ ${escapeHTML(
                item[0]
              )}:

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
   FILE → BASE64
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


          resolve(
            base64
          );

        };


      reader.onerror =
        function(error) {

          reject(
            error
          );

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
   GENERATE TRANSACTION ID
   ========================================================= */

function generateTransactionId() {

  return (

    "TX-" +

    Date.now() +

    "-" +

    Math.random()
      .toString(36)
      .substring(2, 10)

  );

}


/* =========================================================
   SUBMIT KE GOOGLE APPS SCRIPT
   ========================================================= */

async function submitToGoogle() {

  if (
    !GOOGLE_SCRIPT_URL
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


  /* -------------------------------------------------------
     BUAT TRANSACTION ID
     ------------------------------------------------------- */

  currentTransactionId =
    generateTransactionId();


  responseReceived =
    false;


  pollingAttempts =
    0;


  console.log(
    "[SKBT] Transaction ID:",
    currentTransactionId
  );


  /* -------------------------------------------------------
     KUMPULKAN FILE
     ------------------------------------------------------- */

  const files =
    await collectFiles();


  /* -------------------------------------------------------
     DATA
     ------------------------------------------------------- */

  const payload = {

    action:
      "submit",

    transactionId:
      currentTransactionId,

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
      JSON.stringify(
        files
      )

  };


  /* -------------------------------------------------------
     IFRAME
     ------------------------------------------------------- */

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


  /* -------------------------------------------------------
     FORM POST
     ------------------------------------------------------- */

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
    "[SKBT] Mengirim data ke Google Apps Script..."
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
    2000
  );


  /* -------------------------------------------------------
     MULAI POLLING
     ------------------------------------------------------- */

  startPolling(
    currentTransactionId
  );

}


/* =========================================================
   MULAI POLLING
   ========================================================= */

function startPolling(
  transactionId
) {

  stopPolling();


  pollingAttempts =
    0;


  console.log(
    "[SKBT] Polling dimulai:",
    transactionId
  );


  checkStatus(
    transactionId
  );

}


/* =========================================================
   STOP POLLING
   ========================================================= */

function stopPolling() {

  if (
    pollingTimer
  ) {

    clearTimeout(
      pollingTimer
    );

    pollingTimer =
      null;

  }

}


/* =========================================================
   CEK STATUS / NOMOR
   ========================================================= */

async function checkStatus(
  transactionId
) {

  if (
    responseReceived
  ) {

    return;

  }


  pollingAttempts++;


  console.log(
    "[SKBT] Cek nomor:",
    pollingAttempts,
    "/ 30"
  );


  const url =
    GOOGLE_SCRIPT_URL +
    "?action=status" +
    "&transactionId=" +
    encodeURIComponent(
      transactionId
    ) +
    "&t=" +
    Date.now();


  try {

    const response =
      await fetch(
        url,
        {
          method:
            "GET",

          cache:
            "no-store"
        }
      );


    if (
      response.ok
    ) {

      const data =
        await response.json();


      console.log(
        "[SKBT] Status:",
        data
      );


      /* ---------------------------------------------------
         NOMOR SUDAH DITEMUKAN
         --------------------------------------------------- */

      if (
        data &&
        data.success === true &&
        data.found === true &&
        data.nomor
      ) {

        responseReceived =
          true;


        stopPolling();


        handleSubmissionResponse({

          success:
            true,

          nomor:
            data.nomor,

          transactionId:
            transactionId,

          message:
            "Permohonan berhasil disimpan."

        });


        return;

      }

    }

  }

  catch (error) {

    console.warn(
      "[SKBT] Error polling:",
      error
    );

  }


  /* -------------------------------------------------------
     JIKA BELUM DITEMUKAN
     ------------------------------------------------------- */

  if (
    pollingAttempts >= 30
  ) {

    stopPolling();


    hideSubmitLoading();


    resetSubmitButton();


    isSubmitting =
      false;


    alert(

      "Permohonan sedang diproses, tetapi nomor permohonan belum dapat ditampilkan.\n\n" +

      "JANGAN mengirim ulang permohonan.\n\n" +

      "Silakan gunakan menu Cek Status Permohonan."

    );


    return;

  }


  /* -------------------------------------------------------
     CEK LAGI 2 DETIK
     ------------------------------------------------------- */

  pollingTimer =
    setTimeout(
      function() {

        checkStatus(
          transactionId
        );

      },
      2000
    );

}


/* =========================================================
   POSTMESSAGE
   ---------------------------------------------------------
   Tetap dipertahankan sebagai jalur cepat.
   Polling tetap bekerja jika postMessage tidak berhasil.
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


    /*
     * Kalau polling sudah mendapatkan
     * nomor, jangan tampilkan dua kali.
     */

    if (
      responseReceived
    ) {

      return;

    }


    /*
     * Response berhasil.
     */

    if (
      data.success === true &&
      data.nomor
    ) {

      responseReceived =
        true;


      stopPolling();


      handleSubmissionResponse(
        data
      );


      return;

    }


    /*
     * Response gagal.
     */

    if (
      data.success === false
    ) {

      responseReceived =
        true;


      stopPolling();


      handleSubmissionResponse(
        data
      );

    }

  },
  false
);


/* =========================================================
   PROSES RESPONSE
   ========================================================= */

function handleSubmissionResponse(
  data
) {

  if (!data) {

    return;

  }


  stopPolling();


  responseReceived =
    true;


  hideSubmitLoading();


  const sending =
    document.getElementById(
      "sending"
    );


  if (sending) {

    sending.classList.remove(
      "show"
    );

  }


  /* -------------------------------------------------------
     GAGAL
     ------------------------------------------------------- */

  if (
    data.success === false
  ) {

    resetSubmitButton();


    isSubmitting =
      false;


    alert(
      data.message ||
      "Permohonan gagal diproses."
    );


    return;

  }


  /* -------------------------------------------------------
     NOMOR
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


  /* -------------------------------------------------------
     SIMPAN KE SESSION
     ------------------------------------------------------- */

  try {

    sessionStorage.setItem(
      "SKBT_NOMOR",
      data.nomor ||
      ""
    );


    if (
      data.transactionId
    ) {

      sessionStorage.setItem(
        "SKBT_TRANSACTION_ID",
        data.transactionId
      );

    }

  }

  catch (error) {

    console.warn(
      "[SKBT] sessionStorage tidak tersedia."
    );

  }


  /* -------------------------------------------------------
     SEMBUNYIKAN FORM
     ------------------------------------------------------- */

  const form =
    document.getElementById(
      "form"
    );


  if (form) {

    form.style.display =
      "none";

  }


  /* -------------------------------------------------------
     SEMBUNYIKAN PROGRESS
     ------------------------------------------------------- */

  const progress =
    document.querySelector(
      ".progress"
    );


  if (progress) {

    progress.style.display =
      "none";

  }


  /* -------------------------------------------------------
     TAMPILKAN SUKSES
     ------------------------------------------------------- */

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


  /*
   * Jangan membuka kembali tombol
   * setelah berhasil.
   */

  isSubmitting =
    true;


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

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


  const sending =
    document.getElementById(
      "sending"
    );


  if (sending) {

    sending.classList.remove(
      "show"
    );

  }

}


/* =========================================================
   KUNCI TOMBOL
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
   RESET TOMBOL
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


      /* ---------------------------------------------------
         CEGAH DOUBLE CLICK
         --------------------------------------------------- */

      if (isSubmitting) {

        console.log(
          "[SKBT] Submit diabaikan karena proses sedang berjalan."
        );


        return;

      }


      /* ---------------------------------------------------
         CHECKLIST
         --------------------------------------------------- */

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


      /* ---------------------------------------------------
         VALIDASI STEP 1
         --------------------------------------------------- */

      if (!valid(1)) {

        step = 1;

        show();

        return;

      }


      /* ---------------------------------------------------
         VALIDASI STEP 2
         --------------------------------------------------- */

      if (!valid(2)) {

        step = 2;

        show();

        return;

      }


      /* ---------------------------------------------------
         MULAI SUBMIT
         --------------------------------------------------- */

      isSubmitting =
        true;


      lockSubmitButton();


      showSubmitLoading();


      try {

        await submitToGoogle();

      }

      catch (error) {

        console.error(
          "[SKBT] ERROR SUBMIT:",
          error
        );


        stopPolling();


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
   DATA DARI CHATBOT
   ========================================================= */

function loadChatbotData() {

  try {

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


    const encoded =
      hash.substring(
        "#chatdata=".length
      );


    const json =
      decodeURIComponent(
        encoded
      );


    const data =
      JSON.parse(
        json
      );


    console.log(
      "[SKBT] DATA DARI CHATBOT:",
      data
    );


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


    const keperluanElement =
      document.getElementById(
        "keperluan"
      );


    if (
      keperluanElement
    ) {

      keperluanElement.dispatchEvent(

        new Event(
          "change",
          {
            bubbles: true
          }
        )

      );

    }


    /* -----------------------------------------------------
       HAPUS DATA DARI URL
       ----------------------------------------------------- */

    history.replaceState(

      null,

      "",

      window.location.pathname +
      window.location.search

    );


    showChatbotNotice();

  }

  catch(error) {

    console.error(
      "[SKBT] GAGAL MEMBACA DATA CHATBOT:",
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
      "[SKBT] Field tidak ditemukan:",
      id
    );


    return;

  }


  element.value =
    value || "";


  element.dispatchEvent(

    new Event(
      "input",
      {
        bubbles: true
      }
    )

  );


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
   NOTIFIKASI CHATBOT
   ========================================================= */

function showChatbotNotice() {

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
   DOM READY
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadChatbotData();

  }
);
const dataSKPD = {
            "Sekretariat & Inspektorat": [
                "Sekretariat Daerah",
                "Sekretariat Dewan Perwakilan Rakyat",
                "Inspektorat Daerah"
            ],
            "Dinas-Dinas Daerah": [
                "Dinas Pendidikan dan Kebudayaan",
                "Dinas Kesehatan",
                "Dinas Pekerjaan Umum dan Perumahan Rakyat",
                "Satuan Polisi Pamong Praja dan Wilayatul Hisbah",
                "Dinas Sosial",
                "Dinas Perindustrian, Tenaga Kerja, dan Transmigrasi",
                "Dinas Pemberdayaan Perempuan, Perlindungan Anak, dan Keluarga Berencana",
                "Dinas Ketahanan Pangan dan Penyuluhan",
                "Dinas Lingkungan Hidup",
                "Dinas Kependudukan dan Pencatatan Sipil",
                "Dinas Pemberdayaan Masyarakat dan Gampong",
                "Dinas Perhubungan",
                "Dinas Komunikasi dan Informatika",
                "Dinas Perdagangan, Koperasi, dan Usaha Kecil Menengah",
                "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu",
                "Dinas Pariwisata, Pemuda, dan Olahraga",
                "Dinas Perpustakaan dan Kearsipan",
                "Dinas Perikanan",
                "Dinas Tanaman Pangan dan Hortikultura",
                "Dinas Perkebunan dan Peternakan",
                "Dinas Syariat Islam",
                "Dinas Pendidikan Dayah",
                "Dinas Pertanahan"
            ],
            "Badan-Badan Daerah": [
                "Badan Perencanaan Pembangunan Daerah",
                "Badan Pengelolaan Keuangan dan Pendapatan Daerah",
                "Badan Kepegawaian dan Pengembangan Sumber Daya Manusia",
                "Badan Kesatuan Bangsa dan Politik",
                "Badan Penanggulangan Bencana Daerah"
            ],
            "Lembaga Keistimewaan & Sekretariat Khusus": [
                "Sekretariat Majelis Permusyawaratan Ulama",
                "Sekretariat Majelis Adat Aceh",
                "Sekretariat Majelis Pendidikan Aceh",
                "Sekretariat Baitul Mal"
            ],
            "Kecamatan": [
                "Kecamatan Banda Alam",
                "Kecamatan Birem Bayeun",
                "Kecamatan Darul Aman",
                "Kecamatan Darul Ihsan",
                "Kecamatan Idi Rayeuk",
                "Kecamatan Idi Timur",
                "Kecamatan Idi Tunong",
                "Kecamatan Indra Makmu",
                "Kecamatan Julok",
                "Kecamatan Madat",
                "Kecamatan Nurussalam",
                "Kecamatan Pante Bidari",
                "Kecamatan Peudawa",
                "Kecamatan Peureulak",
                "Kecamatan Peureulak Barat",
                "Kecamatan Peureulak Timur",
                "Kecamatan Ranto Peureulak",
                "Kecamatan Ranto Selamat",
                "Kecamatan Serbajadi",
                "Kecamatan Simpang Jernih",
                "Kecamatan Simpang Ulim",
                "Kecamatan Sungai Raya"
            ]
          "Rumah Sakit Umum Daerah": [
               "RSUD dr. Zubir Mahmud",
               "UPTD RSUD Sultan Abdul Aziz Syah "
          ]
        };

        const selectElement = document.getElementById('instansi');

        for (const [kategori, daftar] of Object.entries(dataSKPD)) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = kategori;

            daftar.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                optgroup.appendChild(option);
            });

            selectElement.appendChild(optgroup);
        }
