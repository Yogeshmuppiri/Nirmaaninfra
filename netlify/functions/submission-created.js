exports.handler = async () => {
    console.log("submission-created disabled in favor of send-contact-email");

    return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, skipped: true })
    };
};
