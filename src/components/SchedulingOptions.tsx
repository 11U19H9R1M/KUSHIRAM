import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Users, 
  Shield, 
  Bell, 
  CalendarClock,
  Repeat,
  Lock,
  Unlock,
  Wallet,
  ListChecks,
  Layers,
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, addDays, addWeeks, addMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import BlockchainVerification from "@/components/BlockchainVerification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface SchedulingOptionsProps {
  unlockDate: Date | undefined;
  onUnlockDateChange: (date: Date | undefined) => void;
}

const SchedulingOptions = ({ unlockDate, onUnlockDateChange }: SchedulingOptionsProps) => {
  const [releaseType, setReleaseType] = useState<"immediate" | "scheduled" | "gradual" | "conditional">("scheduled");
  const [gradualReleaseStages, setGradualReleaseStages] = useState([
    { title: "Abstract Only", days: 0 },
    { title: "Key Findings", days: 7 },
    { title: "Full Document", days: 14 }
  ]);
  const [blockchainVerification, setBlockchainVerification] = useState(false);
  const [accessList, setAccessList] = useState<string[]>([]);
  const [newAccessEntity, setNewAccessEntity] = useState("");
  const [accessEntityType, setAccessEntityType] = useState<"email" | "role" | "department">("email");
  const [notifyOnRelease, setNotifyOnRelease] = useState(true);
  const [notifyOnAccess, setNotifyOnAccess] = useState(false);
  const [notifyOnVerification, setNotifyOnVerification] = useState(false);
  const [accessExpiryEnabled, setAccessExpiryEnabled] = useState(false);
  const [accessExpiryDays, setAccessExpiryDays] = useState(30);
  const [documentEncryption, setDocumentEncryption] = useState(true);
  
  // Access conditions
  const [isAdvancedAccessControl, setIsAdvancedAccessControl] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [accessCountLimit, setAccessCountLimit] = useState(0);
  
  // Time lock settings
  const [selectedPreset, setSelectedPreset] = useState("");
  
  const handleAddAccessEntity = () => {
    if (!newAccessEntity.trim()) {
      toast.error("Please enter a valid email, role, or department");
      return;
    }
    
    if (accessEntityType === "email" && !newAccessEntity.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setAccessList([...accessList, `${accessEntityType}:${newAccessEntity}`]);
    setNewAccessEntity("");
    toast.success(`Added ${accessEntityType}: ${newAccessEntity} to access list`);
  };
  
  const handleRemoveAccessEntity = (entity: string) => {
    setAccessList(accessList.filter(item => item !== entity));
  };
  
  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    const now = new Date();
    
    switch(preset) {
      case "end-of-semester":
        // Set to approximately end of semester (4 months from now)
        onUnlockDateChange(addMonths(now, 4));
        break;
      case "next-week":
        onUnlockDateChange(addWeeks(now, 1));
        break;
      case "next-month":
        onUnlockDateChange(addMonths(now, 1));
        break;
      case "tomorrow":
        onUnlockDateChange(addDays(now, 1));
        break;
      case "exam-period":
        // Set to approximately exam period (3.5 months from now)
        onUnlockDateChange(addDays(addMonths(now, 3), 15));
        break;
      default:
        // Keep current date
        break;
    }
  };
  
  const addGradualStage = () => {
    if (gradualReleaseStages.length >= 5) {
      toast.error("Maximum 5 stages allowed");
      return;
    }
    
    const lastStage = gradualReleaseStages[gradualReleaseStages.length - 1];
    const newStage = {
      title: "New Stage",
      days: lastStage.days + 7
    };
    
    setGradualReleaseStages([...gradualReleaseStages, newStage]);
  };
  
  const removeGradualStage = (index: number) => {
    if (gradualReleaseStages.length <= 2) {
      toast.error("Minimum 2 stages required for gradual release");
      return;
    }
    
    const newStages = [...gradualReleaseStages];
    newStages.splice(index, 1);
    setGradualReleaseStages(newStages);
  };
  
  const updateGradualStage = (index: number, field: "title" | "days", value: string | number) => {
    const newStages = [...gradualReleaseStages];
    newStages[index] = {
      ...newStages[index],
      [field]: value
    };
    setGradualReleaseStages(newStages);
  };
  
  return (
    <div className="space-y-8 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-morphism border-white/20 shadow-lg p-2">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <CalendarClock className="h-5 w-5 text-primary" />
                  Time-Lock Configuration
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>Release Type</Label>
                    <Select value={releaseType} onValueChange={(value: any) => setReleaseType(value)}>
                      <SelectTrigger className="mt-1.5 glass-input">
                        <SelectValue placeholder="Select release type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate Release</SelectItem>
                        <SelectItem value="scheduled">Scheduled Release</SelectItem>
                        <SelectItem value="gradual">Gradual/Phased Release</SelectItem>
                        <SelectItem value="conditional">Conditional Release</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {releaseType === "scheduled" && (
                    <div className="space-y-4">
                      <div>
                        <Label>Quick Presets</Label>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          <Badge 
                            variant={selectedPreset === "tomorrow" ? "default" : "outline"} 
                            className="cursor-pointer"
                            onClick={() => handlePresetSelect("tomorrow")}
                          >
                            Tomorrow
                          </Badge>
                          <Badge 
                            variant={selectedPreset === "next-week" ? "default" : "outline"} 
                            className="cursor-pointer"
                            onClick={() => handlePresetSelect("next-week")}
                          >
                            Next Week
                          </Badge>
                          <Badge 
                            variant={selectedPreset === "next-month" ? "default" : "outline"} 
                            className="cursor-pointer"
                            onClick={() => handlePresetSelect("next-month")}
                          >
                            Next Month
                          </Badge>
                          <Badge 
                            variant={selectedPreset === "exam-period" ? "default" : "outline"} 
                            className="cursor-pointer"
                            onClick={() => handlePresetSelect("exam-period")}
                          >
                            Exam Period
                          </Badge>
                          <Badge 
                            variant={selectedPreset === "end-of-semester" ? "default" : "outline"} 
                            className="cursor-pointer"
                            onClick={() => handlePresetSelect("end-of-semester")}
                          >
                            End of Semester
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Custom Release Date</Label>
                        <div className="mt-1.5">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal glass-button",
                                  !unlockDate && "text-muted-foreground"
                                )}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {unlockDate ? format(unlockDate, "PPP") : "Select release date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 glass-morphism">
                              <CalendarComponent
                                mode="single"
                                selected={unlockDate}
                                onSelect={onUnlockDateChange}
                                initialFocus
                                disabled={{ before: new Date() }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <Switch id="access-expiry" checked={accessExpiryEnabled} onCheckedChange={setAccessExpiryEnabled} />
                          <Label htmlFor="access-expiry">Auto-expire access after release</Label>
                        </div>
                        
                        {accessExpiryEnabled && (
                          <div className="mt-2 pl-6 border-l-2 border-primary/20 pt-2">
                            <Label className="mb-2 block">Expire after {accessExpiryDays} days</Label>
                            <Slider
                              value={[accessExpiryDays]}
                              min={1}
                              max={90}
                              step={1}
                              onValueChange={(values) => setAccessExpiryDays(values[0])}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {releaseType === "gradual" && (
                    <div className="space-y-4">
                      <Label>Gradual Release Stages</Label>
                      <div className="space-y-3">
                        {gradualReleaseStages.map((stage, index) => (
                          <div key={index} className="flex items-end gap-2 p-2 border border-border rounded-md bg-card">
                            <div className="flex-1">
                              <Label>Stage Title</Label>
                              <Input 
                                value={stage.title} 
                                onChange={(e) => updateGradualStage(index, "title", e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div className="w-24">
                              <Label>Days</Label>
                              <Input 
                                type="number" 
                                value={stage.days} 
                                min={index === 0 ? 0 : gradualReleaseStages[index-1].days + 1}
                                onChange={(e) => updateGradualStage(index, "days", parseInt(e.target.value))}
                                className="mt-1"
                              />
                            </div>
                            {index > 0 && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeGradualStage(index)}
                                className="flex-shrink-0"
                              >
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        ))}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={addGradualStage}
                          className="w-full mt-2"
                        >
                          Add Stage
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {releaseType === "conditional" && (
                    <div className="space-y-4">
                      <div>
                        <Label>Base Release Date</Label>
                        <div className="mt-1.5">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {unlockDate ? format(unlockDate, "PPP") : "Select base release date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={unlockDate}
                                onSelect={onUnlockDateChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="condition-1">
                          <AccordionTrigger>Citation Count Condition</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Switch id="citation-condition" />
                                <Label htmlFor="citation-condition">Release when cited X times</Label>
                              </div>
                              <Input type="number" placeholder="Number of citations" min={1} className="mt-1" />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="condition-2">
                          <AccordionTrigger>External Event Condition</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Switch id="event-condition" />
                                <Label htmlFor="event-condition">Release after external event</Label>
                              </div>
                              <Select>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="exam-completion">Exam Completion</SelectItem>
                                  <SelectItem value="grade-publication">Grade Publication</SelectItem>
                                  <SelectItem value="conference">Conference Date</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="condition-3">
                          <AccordionTrigger>Manual Approval Condition</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Switch id="approval-condition" checked={requiresApproval} onCheckedChange={setRequiresApproval} />
                                <Label htmlFor="approval-condition">Require manual approval</Label>
                              </div>
                              
                              {requiresApproval && (
                                <div className="pl-6 border-l-2 border-primary/20 pt-2 space-y-2">
                                  <Label>Approvers</Label>
                                  <Input placeholder="Enter approver email" className="mt-1" />
                                  <Button variant="outline" size="sm">Add Approver</Button>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism border-white/20 shadow-lg p-2">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  Access Control
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Advanced Access Controls</Label>
                    <Switch 
                      checked={isAdvancedAccessControl}
                      onCheckedChange={setIsAdvancedAccessControl}
                    />
                  </div>
                  
                  {isAdvancedAccessControl && (
                    <div className="pl-4 border-l-2 border-primary/20 space-y-4">
                      <div>
                        <Label className="mb-2">Access Entity Type</Label>
                        <Select 
                          value={accessEntityType} 
                          onValueChange={(value: any) => setAccessEntityType(value)}
                        >
                          <SelectTrigger className="glass-input">
                            <SelectValue placeholder="Select entity type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email Address</SelectItem>
                            <SelectItem value="role">Role/Position</SelectItem>
                            <SelectItem value="department">Department</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <Label htmlFor="access-entity">
                            {accessEntityType === "email" ? "Email Address" : 
                             accessEntityType === "role" ? "Role/Position" : "Department"}
                          </Label>
                          <Input
                            id="access-entity"
                            value={newAccessEntity}
                            onChange={(e) => setNewAccessEntity(e.target.value)}
                            placeholder={accessEntityType === "email" ? "user@university.edu" : 
                                         accessEntityType === "role" ? "Professor, TA, Student" : "Computer Science"}
                            className="mt-1.5 glass-input"
                          />
                        </div>
                        <Button onClick={handleAddAccessEntity}>Add</Button>
                      </div>
                      
                      {accessList.length > 0 && (
                        <div>
                          <Label className="mb-2 block">Current Access List</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {accessList.map((entity, index) => {
                              const [type, value] = entity.split(":");
                              return (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                  {type === "email" ? "@" : 
                                   type === "role" ? <Users className="h-3 w-3" /> : 
                                   <Layers className="h-3 w-3" />}
                                  {value}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 ml-1 hover:bg-destructive/20 rounded-full"
                                    onClick={() => handleRemoveAccessEntity(entity)}
                                  >
                                    <AlertTriangle className="h-3 w-3 text-destructive" />
                                  </Button>
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Switch id="access-count-limit" 
                            checked={accessCountLimit > 0}
                            onCheckedChange={(checked) => setAccessCountLimit(checked ? 3 : 0)}
                          />
                          <Label htmlFor="access-count-limit">Limit number of access attempts</Label>
                        </div>
                        
                        {accessCountLimit > 0 && (
                          <div className="pl-6 border-l-2 border-primary/20 pt-2">
                            <Label className="mb-2 block">Maximum {accessCountLimit} access attempts</Label>
                            <Slider
                              value={[accessCountLimit]}
                              min={1}
                              max={10}
                              step={1}
                              onValueChange={(values) => setAccessCountLimit(values[0])}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <Wallet className="h-5 w-5 text-primary" />
                  Blockchain Verification
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Blockchain Verification</Label>
                      <p className="text-sm text-muted-foreground">Secure your document with tamper-proof verification</p>
                    </div>
                    <Switch 
                      checked={blockchainVerification}
                      onCheckedChange={setBlockchainVerification}
                    />
                  </div>
                  
                  {blockchainVerification && (
                    <div className="pl-4 border-l-2 border-primary/20 space-y-4 mt-4">
                      <Tabs defaultValue="standard">
                        <TabsList className="grid grid-cols-2 w-full">
                          <TabsTrigger value="standard">Standard</TabsTrigger>
                          <TabsTrigger value="advanced">Advanced</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="standard" className="p-2">
                          <div className="space-y-2">
                            <p className="text-sm">Standard verification creates a unique hash of your document and stores it on a public blockchain.</p>
                            
                            <div className="flex items-center gap-2 mt-3">
                              <Switch id="document-encryption" checked={documentEncryption} onCheckedChange={setDocumentEncryption} />
                              <Label htmlFor="document-encryption">Enable document encryption</Label>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="advanced" className="p-2">
                          <div className="space-y-2">
                            <p className="text-sm">Advanced verification adds metadata and enables smart contract functionality.</p>
                            
                            <Select defaultValue="ethereum">
                              <SelectTrigger className="mt-3">
                                <SelectValue placeholder="Select blockchain" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ethereum">Ethereum</SelectItem>
                                <SelectItem value="solana">Solana</SelectItem>
                                <SelectItem value="polygon">Polygon</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <div className="flex items-center gap-2 mt-3">
                              <Switch id="meta-verification" defaultChecked />
                              <Label htmlFor="meta-verification">Include document metadata</Label>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-release">Document Release</Label>
                    <Switch 
                      id="notify-release" 
                      checked={notifyOnRelease}
                      onCheckedChange={setNotifyOnRelease}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-access">Access Attempts</Label>
                    <Switch 
                      id="notify-access" 
                      checked={notifyOnAccess}
                      onCheckedChange={setNotifyOnAccess}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-verification">Verification Status</Label>
                    <Switch 
                      id="notify-verification" 
                      checked={notifyOnVerification}
                      onCheckedChange={setNotifyOnVerification}
                    />
                  </div>
                  
                  {(notifyOnRelease || notifyOnAccess || notifyOnVerification) && (
                    <div className="pt-2">
                      <Label>Additional Recipients</Label>
                      <Input 
                        placeholder="Enter emails separated by commas" 
                        className="mt-1.5 glass-input"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {blockchainVerification && (
        <div className="mt-6">
          <BlockchainVerification />
        </div>
      )}
      
      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => toast.success("Settings saved as draft")}
        >
          Save as Draft
        </Button>
        <Button 
          type="button"
          onClick={() => toast.success("Access control configuration applied successfully")}
        >
          Apply Configuration
        </Button>
      </div>
    </div>
  );
};

export default SchedulingOptions;
