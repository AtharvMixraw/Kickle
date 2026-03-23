import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { GridLiveEmail } from "@/emails/GridLiveEmail";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://footballgrid.vercel.app";
const FROM_EMAIL = process.env.FROM_EMAIL || "Football Grid <noreply@yourdomain.com>";
const IS_TEST_MODE = FROM_EMAIL === "onboarding@resend.dev";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { gridNumber } = await request.json();

    if (!gridNumber) {
      return NextResponse.json({ error: "gridNumber required" }, { status: 400 });
    }

    // Fetch all users who have played at least one game
    const users = await prisma.user.findMany({
      where: {
        submissions: { some: {} },
      },
      select: { email: true, name: true },
    });

    if (users.length === 0) {
      return NextResponse.json({ message: "No users to notify", sent: 0 });
    }

    // In test mode, only send to admin email (Resend restriction for unverified domains)
    const recipients = IS_TEST_MODE
      ? [{ email: ADMIN_EMAIL!, name: "Admin" }]
      : users;

    // Resend supports batch sending — max 100 per call
    const emails = recipients.map((user) => ({
      from: FROM_EMAIL,
      to: user.email,
      subject: `⚽ Grid #${gridNumber} is live — play now!`,
      react: GridLiveEmail({ gridNumber, siteUrl: SITE_URL }),
    }));

    // Send in batches of 100
    let totalSent = 0;
    const batchSize = 100;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const { data, error } = await resend.batch.send(batch);

      if (error) {
        console.error("Resend batch error:", error);
        return NextResponse.json(
          { error: "Failed to send emails", detail: error },
          { status: 500 }
        );
      }

      totalSent += data?.data?.length ?? batch.length;
    }

    return NextResponse.json({
      success: true,
      sent: totalSent,
      message: `Notified ${totalSent} player${totalSent !== 1 ? "s" : ""}`,
    });
  } catch (error) {
    console.error("Notify error:", error);
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 });
  }
}