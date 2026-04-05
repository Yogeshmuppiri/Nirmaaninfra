const nodemailer = require("nodemailer");

const OWNER_EMAIL = "nirmaaninfrasupport@gmail.com";
const DEFAULT_SITE_URL = "https://nirmaaninfra.netlify.app";
const CONTACT_PHONE = "+91 63042 11353";

const escapeHtml = (value = "") =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");

const formatMultilineHtml = (value = "") =>
    escapeHtml(value).replace(/\r?\n/g, "<br>");

const normalizeUrl = (value) => {
    if (!value) {
        return DEFAULT_SITE_URL;
    }

    return value.endsWith("/") ? value.slice(0, -1) : value;
};

const buildEmailShell = ({ logoUrl, eyebrow, title, intro, bodyHtml, footerNote }) => `
    <div style="margin:0;padding:32px 16px;background:linear-gradient(180deg,#eaf2fb 0%,#f8fafc 100%);font-family:Arial,sans-serif;color:#1e293b;">
        <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 24px 70px rgba(15,23,42,0.14);border:1px solid rgba(148,163,184,0.18);">
            <div style="padding:34px 32px 28px;background:radial-gradient(circle at top right, rgba(6,182,212,0.35), transparent 30%),radial-gradient(circle at left center, rgba(37,99,235,0.4), transparent 32%),linear-gradient(135deg,#0f172a,#1d4ed8);text-align:center;">
                <img src="${logoUrl}" alt="Nirmaan Infra Logo" style="max-width:124px;width:100%;height:auto;display:block;margin:0 auto 18px;">
                <div style="display:inline-block;padding:7px 14px;border-radius:999px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.18);font-size:11px;font-weight:700;letter-spacing:0.16em;color:#dbeafe;text-transform:uppercase;">${eyebrow}</div>
                <div style="margin-top:18px;font-size:30px;font-weight:800;letter-spacing:0.05em;color:#ffffff;text-transform:uppercase;">Nirmaan Infra</div>
                <p style="margin:12px auto 0;max-width:480px;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.84);">Building your dreams with construction and engineering excellence.</p>
            </div>
            <div style="padding:34px 32px 26px;">
                <h1 style="margin:0 0 12px;font-size:30px;line-height:1.2;color:#0f172a;">${title}</h1>
                <p style="margin:0 0 26px;font-size:16px;line-height:1.8;color:#475569;">${intro}</p>
                ${bodyHtml}
            </div>
            <div style="padding:22px 32px;border-top:1px solid #e2e8f0;background:#f8fafc;">
                <p style="margin:0;font-size:13px;line-height:1.7;color:#64748b;">${footerNote}</p>
            </div>
        </div>
    </div>
`;

const buildOwnerEmail = ({ logoUrl, submission }) =>
    buildEmailShell({
        logoUrl,
        eyebrow: "New Lead",
        title: "New Contact Form Inquiry",
        intro: "A new website inquiry has been submitted through the Nirmaan Infra contact form.",
        bodyHtml: `
            <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
                <tr>
                    <td style="padding:14px 16px;background:#eff6ff;font-weight:700;color:#0f172a;width:140px;">Name</td>
                    <td style="padding:14px 16px;border-top:1px solid #e2e8f0;color:#334155;">${escapeHtml(submission.name)}</td>
                </tr>
                <tr>
                    <td style="padding:14px 16px;background:#eff6ff;font-weight:700;color:#0f172a;">Email</td>
                    <td style="padding:14px 16px;border-top:1px solid #e2e8f0;color:#334155;">${escapeHtml(submission.email)}</td>
                </tr>
                <tr>
                    <td style="padding:14px 16px;background:#eff6ff;font-weight:700;color:#0f172a;">Subject</td>
                    <td style="padding:14px 16px;border-top:1px solid #e2e8f0;color:#334155;">${escapeHtml(submission.subject)}</td>
                </tr>
                <tr>
                    <td style="padding:14px 16px;background:#eff6ff;font-weight:700;color:#0f172a;vertical-align:top;">Message</td>
                    <td style="padding:14px 16px;border-top:1px solid #e2e8f0;color:#334155;line-height:1.7;">${formatMultilineHtml(submission.message)}</td>
                </tr>
            </table>
        `,
        footerNote: "This email was generated automatically from the Nirmaan Infra website."
    });

const buildCustomerEmail = ({ logoUrl, submission }) =>
    buildEmailShell({
        logoUrl,
        eyebrow: "Inquiry Received",
        title: `Thank you for reaching out, ${escapeHtml(submission.name || "there")}`,
        intro: "We appreciate you contacting Nirmaan Infra. Our team has received your message and will get back to you during our regular working hours.",
        bodyHtml: `
            <div style="padding:22px 24px;border-radius:18px;background:linear-gradient(135deg,#eff6ff,#f8fafc);border:1px solid #dbeafe;margin-bottom:24px;">
                <div style="display:inline-block;padding:7px 12px;border-radius:999px;background:#dbeafe;color:#1d4ed8;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:14px;">Thank You</div>
                <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#334155;">
                    We have received your inquiry regarding <strong>${escapeHtml(submission.subject || "your request")}</strong>.
                </p>
                <p style="margin:0;font-size:15px;line-height:1.7;color:#334155;">
                    Our normal response window is during business hours: Monday to Friday, 9:00 AM to 6:00 PM, and Saturday, 10:00 AM to 4:00 PM.
                </p>
            </div>
            <div style="margin-bottom:24px;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;">
                <div style="padding:16px 20px;background:#ffffff;border-bottom:1px solid #e2e8f0;">
                    <div style="font-size:13px;font-weight:700;letter-spacing:0.08em;color:#0f172a;text-transform:uppercase;">What Happens Next</div>
                </div>
                <div style="padding:18px 20px;background:#ffffff;">
                    <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#475569;">Our team will review your inquiry and get back to you with the right next step, whether that is a callback, project discussion, site visit, or service consultation.</p>
                    <p style="margin:0;font-size:15px;line-height:1.7;color:#475569;">If your requirement is urgent, you can reply directly to this email or reach out through phone or WhatsApp.</p>
                </div>
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px;">
                <div style="flex:1 1 200px;padding:18px 20px;border-radius:18px;background:#0f172a;color:#ffffff;">
                    <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#93c5fd;margin-bottom:8px;">Phone</div>
                    <div style="font-size:16px;font-weight:700;line-height:1.5;">${CONTACT_PHONE}</div>
                </div>
                <div style="flex:1 1 200px;padding:18px 20px;border-radius:18px;background:#ecfeff;color:#0f172a;border:1px solid #bae6fd;">
                    <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#0891b2;margin-bottom:8px;">Email</div>
                    <div style="font-size:16px;font-weight:700;line-height:1.5;">nirmaaninfrasupport@gmail.com</div>
                </div>
            </div>
            <p style="margin:0;font-size:15px;line-height:1.7;color:#475569;">Thank you for considering Nirmaan Infra.</p>
        `,
        footerNote: "Nirmaan Infra | Building your dreams with construction and engineering excellence."
    });

const createTransporter = () => {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_APP_PASSWORD;
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || 465);

    if (!smtpUser || !smtpPass) {
        throw new Error("Missing SMTP_USER or SMTP_APP_PASSWORD environment variables.");
    }

    return nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    });
};

const parseBody = (event) => {
    if (!event.body) {
        return {};
    }

    return typeof event.body === "string" ? JSON.parse(event.body) : event.body;
};

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ ok: false, error: "Method not allowed" })
        };
    }

    try {
        const body = parseBody(event);
        const submission = {
            name: (body.name || "").trim(),
            email: (body.email || "").trim(),
            subject: (body.subject || "Website Inquiry").trim(),
            message: (body.message || "").trim()
        };

        console.log("send-contact-email invocation", {
            hasBody: Boolean(event.body),
            hasName: Boolean(submission.name),
            hasEmail: Boolean(submission.email),
            hasMessage: Boolean(submission.message)
        });

        if (!submission.name || !submission.email || !submission.subject || !submission.message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ ok: false, error: "Missing required fields." })
            };
        }

        const siteUrl = normalizeUrl(process.env.URL || body.siteUrl);
        const logoUrl = `${siteUrl}/resources/nirmaaninfologo-modified.png`;
        const transporter = createTransporter();
        const smtpUser = process.env.SMTP_USER;
        const from = process.env.MAIL_FROM || `Nirmaan Infra <${smtpUser}>`;
        const ownerEmail = process.env.MAIL_TO || OWNER_EMAIL;

        console.log("send-contact-email env check", {
            hasSmtpUser: Boolean(process.env.SMTP_USER),
            hasSmtpPassword: Boolean(process.env.SMTP_APP_PASSWORD),
            smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
            smtpPort: process.env.SMTP_PORT || "465",
            hasMailTo: Boolean(process.env.MAIL_TO),
            hasMailFrom: Boolean(process.env.MAIL_FROM)
        });

        await transporter.verify();
        console.log("send-contact-email transporter verification passed");

        await transporter.sendMail({
            from,
            to: ownerEmail,
            replyTo: submission.email,
            subject: `New website inquiry from ${submission.name}`,
            html: buildOwnerEmail({ logoUrl, submission })
        });
        console.log("send-contact-email owner email sent", { to: ownerEmail });

        await transporter.sendMail({
            from,
            to: submission.email,
            replyTo: ownerEmail,
            subject: "Thank you for contacting Nirmaan Infra",
            html: buildCustomerEmail({ logoUrl, submission })
        });
        console.log("send-contact-email customer email sent", { to: submission.email });

        return {
            statusCode: 200,
            body: JSON.stringify({ ok: true })
        };
    } catch (error) {
        console.error("send-contact-email failed", {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode,
            stack: error.stack
        });

        return {
            statusCode: 500,
            body: JSON.stringify({
                ok: false,
                error: error.message,
                code: error.code || null,
                command: error.command || null,
                response: error.response || null,
                responseCode: error.responseCode || null
            })
        };
    }
};
