import { useState } from "react";
import { AlertTriangle, X, Shield } from "lucide-react";

export default function ConsentModal({ isOpen, onClose, onConsent, version = "v1.0" }) {
  const [checkboxes, setCheckboxes] = useState({
    liability: false,
    educational: false,
    professional: false
  });

  const allChecked = Object.values(checkboxes).every(v => v);

  const handleConsent = () => {
    if (allChecked) {
      onConsent();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-800 rounded-2xl border border-purple-500/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-purple-500/20 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="text-purple-400" size={24} />
            <div>
              <h2 className="text-2xl font-bold text-white">Important Disclaimer</h2>
              <p className="text-xs text-gray-400 mt-1">Version {version}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-gray-300">
              <p className="font-semibold text-red-400 mb-2">Safety Warning</p>
              <p>
                Home improvement projects can be dangerous. AnotherAfternoon provides
                general guidance only and cannot account for your specific situation.
              </p>
            </div>
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checkboxes.liability}
                onChange={(e) => setCheckboxes({...checkboxes, liability: e.target.checked})}
                className="mt-1 w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                <strong>No Liability:</strong> I understand that AnotherAfternoon has no legal liability
                for any damages, injuries, or losses resulting from following this guidance.
                All projects are undertaken at my own risk.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checkboxes.educational}
                onChange={(e) => setCheckboxes({...checkboxes, educational: e.target.checked})}
                className="mt-1 w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                <strong>Educational Purpose Only:</strong> I acknowledge that this content is
                provided for educational and informational purposes only. It does not replace
                professional advice or expertise.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checkboxes.professional}
                onChange={(e) => setCheckboxes({...checkboxes, professional: e.target.checked})}
                className="mt-1 w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                <strong>Professional Consultation:</strong> I am responsible for consulting with
                licensed professionals (electricians, plumbers, contractors, etc.) before
                undertaking any work. AnotherAfternoon does not replace professional services.
              </span>
            </label>
          </div>

          <div className="text-xs text-gray-500 bg-slate-700/30 rounded-lg p-4">
            <p className="font-semibold mb-2">Additional Considerations:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Check local building codes and permit requirements</li>
              <li>Verify that you're qualified to perform the work safely</li>
              <li>Use appropriate safety equipment and follow manufacturer instructions</li>
              <li>Consider hiring licensed professionals for complex or dangerous work</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-800 border-t border-purple-500/20 p-6 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConsent}
            disabled={!allChecked}
            className={`px-8 py-2 rounded-lg transition-all font-semibold ${
              allChecked
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50"
                : "bg-gray-600 cursor-not-allowed opacity-50"
            }`}
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
}
