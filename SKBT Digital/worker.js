const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwB2-PDQMBuOiCiyBdzsqAh3mfYH-Nkt-HhjiujG-TizDKECLDg6j7sqoBufMSE2uGbZQ/exec";


export default {

  async fetch(
    request,
    env,
    ctx
  ) {

    /*
     * ============================================
     * CORS
     * ============================================
     */

    const corsHeaders = {

      "Access-Control-Allow-Origin":
        "https://habibhanafi.github.io",

      "Access-Control-Allow-Methods":
        "POST, OPTIONS",

      "Access-Control-Allow-Headers":
        "Content-Type",

      "Access-Control-Max-Age":
        "86400"

    };


    /*
     * ============================================
     * PREFLIGHT
     * ============================================
     */

    if (
      request.method === "OPTIONS"
    ) {

      return new Response(
        null,
        {
          status: 204,
          headers: corsHeaders
        }
      );

    }


    /*
     * ============================================
     * HANYA POST
     * ============================================
     */

    if (
      request.method !== "POST"
    ) {

      return new Response(

        JSON.stringify({
          success: false,
          error:
            "Method tidak diperbolehkan."
        }),

        {
          status: 405,

          headers: {

            ...corsHeaders,

            "Content-Type":
              "application/json"

          }

        }

      );

    }


    try {

      /*
       * ==========================================
       * AMBIL DATA DARI CHATBOT
       * ==========================================
       */

      const body =
        await request.text();


      /*
       * ==========================================
       * KIRIM KE APPS SCRIPT
       * ==========================================
       */

      const response =
        await fetch(
          APPS_SCRIPT_URL,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "text/plain;charset=utf-8"

            },

            body: body

          }
        );


      const result =
        await response.text();


      /*
       * ==========================================
       * RESPONSE KE CHATBOT
       * ==========================================
       */

      return new Response(

        result,

        {

          status:
            response.status,

          headers: {

            ...corsHeaders,

            "Content-Type":
              "application/json"

          }

        }

      );


    } catch (error) {

      return new Response(

        JSON.stringify({

          success: false,

          error:
            String(error)

        }),

        {

          status: 500,

          headers: {

            ...corsHeaders,

            "Content-Type":
              "application/json"

          }

        }

      );

    }

  }

};
