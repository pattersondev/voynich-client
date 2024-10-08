import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">
          At Voynich, we are committed to protecting your privacy and ensuring
          the security of your communications.
        </p>
        <h2 className="text-2xl font-semibold mb-3">
          Data Collection and Storage
        </h2>
        <p className="mb-4">
          We do not collect any personal user data. All chat messages are
          encrypted end-to-end, and we do not have access to decrypt these
          messages. The encrypted data is stored temporarily and is permanently
          erased once the chat expires.
        </p>
        <h2 className="text-2xl font-semibold mb-3">Data Retention</h2>
        <p className="mb-4">
          Chat data is only retained for the duration specified by the user when
          creating the chat. Once this period expires, all associated data is
          automatically and permanently deleted from our servers.
        </p>
        <h2 className="text-2xl font-semibold mb-3">Open Source</h2>
        <p className="mb-4">
          Our commitment to privacy and security is reflected in our open-source
          approach. Both our frontend and backend code are publicly available
          for review, ensuring transparency in our practices.
        </p>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
