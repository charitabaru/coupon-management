
import { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SecuritySettings: React.FC = () => {
  const [cooldownPeriod, setCooldownPeriod] = useState(24);
  const [cookieTracking, setCookieTracking] = useState(true);
  const [ipTracking, setIpTracking] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Security Settings</h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="font-medium">Cooldown Period: {cooldownPeriod} hours</Label>
          <Slider
            value={[cooldownPeriod]}
            onValueChange={(value) => setCooldownPeriod(value[0])}
            min={1}
            max={72}
            step={1}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>1h</span>
            <span>24h</span>
            <span>72h</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="cookie-tracking" className="font-medium">Cookie Tracking</Label>
          <Switch
            id="cookie-tracking"
            checked={cookieTracking}
            onCheckedChange={setCookieTracking}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="ip-tracking" className="font-medium">IP Tracking</Label>
          <Switch
            id="ip-tracking"
            checked={ipTracking}
            onCheckedChange={setIpTracking}
          />
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
