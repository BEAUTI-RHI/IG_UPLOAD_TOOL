// app/page.tsx
import { Button } from "@/components/ui/button";
import { Instagram, Upload, Settings, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Instagram Reel Manager
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Upload and manage Instagram reels across multiple business accounts
            in one place.
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mt-16">
          <div className="relative p-6 bg-white rounded-2xl shadow-sm border">
            <div className="absolute top-6 right-6">
              <Upload className="h-6 w-6 text-blue-500" />
            </div>
            <div className="pt-12">
              <h3 className="text-lg font-semibold text-gray-900">
                Bulk Upload
              </h3>
              <p className="mt-2 text-gray-500">
                Upload reels to multiple Instagram business accounts
                simultaneously
              </p>
            </div>
          </div>

          <div className="relative p-6 bg-white rounded-2xl shadow-sm border">
            <div className="absolute top-6 right-6">
              <Instagram className="h-6 w-6 text-blue-500" />
            </div>
            <div className="pt-12">
              <h3 className="text-lg font-semibold text-gray-900">
                Account Management
              </h3>
              <p className="mt-2 text-gray-500">
                Connect and manage multiple Instagram business accounts easily
              </p>
            </div>
          </div>

          <div className="relative p-6 bg-white rounded-2xl shadow-sm border">
            <div className="absolute top-6 right-6">
              <Settings className="h-6 w-6 text-blue-500" />
            </div>
            <div className="pt-12">
              <h3 className="text-lg font-semibold text-gray-900">
                Simple Process
              </h3>
              <p className="mt-2 text-gray-500">
                Easy-to-use interface for managing your Instagram content
              </p>
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Requirements
          </h2>
          <div className="space-y-4">
            {[
              "Instagram Business or Creator Account",
              "Connected Facebook Page",
              "Admin access to the Facebook Page",
              "Proper permissions granted",
            ].map((req, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            By connecting your account, you&apos;ll grant access to manage your
            Instagram content. You can revoke access at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
