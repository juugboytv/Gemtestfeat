export default function SettingsTab() {
  return (
    <div className="h-full">
      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Settings</h2>
      
      <div className="space-y-6">
        {/* Game Settings */}
        <div className="glass-panel p-4 rounded-lg">
          <h3 className="font-orbitron text-lg mb-3 text-orange-400">Game Settings</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Auto-save</span>
              <button className="glass-button px-3 py-1 rounded-md text-sm">
                Enabled
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Combat speed</span>
              <select className="glass-button px-3 py-1 rounded-md text-sm">
                <option>Normal</option>
                <option>Fast</option>
                <option>Instant</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Notifications</span>
              <button className="glass-button px-3 py-1 rounded-md text-sm">
                On
              </button>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="glass-panel p-4 rounded-lg">
          <h3 className="font-orbitron text-lg mb-3 text-orange-400">Display</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Animation effects</span>
              <button className="glass-button px-3 py-1 rounded-md text-sm">
                Enhanced
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">UI scale</span>
              <select className="glass-button px-3 py-1 rounded-md text-sm">
                <option>Small</option>
                <option>Normal</option>
                <option>Large</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="glass-panel p-4 rounded-lg">
          <h3 className="font-orbitron text-lg mb-3 text-orange-400">Account</h3>
          <div className="space-y-3">
            <button className="glass-button w-full py-2 rounded-md">
              Export Save Data
            </button>
            <button className="glass-button w-full py-2 rounded-md">
              Import Save Data
            </button>
            <button className="glass-button w-full py-2 rounded-md text-red-400">
              Reset Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}