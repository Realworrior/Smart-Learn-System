import { AlertCircle, Database, ExternalLink } from 'lucide-react';

export function DatabaseSetupNotice() {
  return (
    <div className="bg-white border-2 border-[#2ac8d2] rounded-lg p-8 max-w-3xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="bg-[#2ac8d2]/10 p-3 rounded-full">
          <Database className="text-[#2ac8d2]" size={32} />
        </div>
        
        <div className="flex-1">
          <h2 className="text-gray-900 mb-2 flex items-center gap-2">
            <AlertCircle size={20} className="text-[#fea37b]" />
            Database Setup Required
          </h2>
          
          <p className="text-gray-600 mb-6">
            The database tables haven't been created yet. Follow these steps to set up your SmartLearn database:
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
              Open Supabase SQL Editor
            </h3>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#2ac8d2] hover:underline mb-4"
            >
              Go to Supabase Dashboard
              <ExternalLink size={16} />
            </a>
            <p className="text-gray-600 text-sm">Navigate to <strong>SQL Editor</strong> in the left sidebar</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
              Run the Database Schema
            </h3>
            <ol className="text-gray-600 text-sm space-y-2 list-decimal list-inside">
              <li>Open the file <code className="bg-white px-2 py-1 rounded text-xs border border-gray-300">/database-schema.sql</code> in this project</li>
              <li>Copy all the SQL code</li>
              <li>Paste it into the Supabase SQL Editor</li>
              <li>Click <strong>Run</strong> to execute</li>
            </ol>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
              Refresh This Page
            </h3>
            <p className="text-gray-600 text-sm mb-3">After running the SQL schema, refresh this page to load the data</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              Refresh Now
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-gray-900 mb-2">What will be created:</h4>
            <ul className="grid grid-cols-2 gap-2 text-gray-600 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-[#2ac8d2] rounded-full"></span>
                Students table
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-[#c5a988] rounded-full"></span>
                Teachers table
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-[#6292b1] rounded-full"></span>
                Classes table
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-[#fea37b] rounded-full"></span>
                Subjects table
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-[#4981a5] rounded-full"></span>
                Timetable table
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-[#2ac8d2] rounded-full"></span>
                Sample data
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-6">
            <p className="text-blue-900 text-sm">
              <strong>Need help?</strong> Check <code className="bg-white px-2 py-1 rounded text-xs border border-blue-300">/SETUP_INSTRUCTIONS.md</code> for detailed setup instructions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
