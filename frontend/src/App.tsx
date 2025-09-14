import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Building2, Users, Flame, Beef } from 'lucide-react';
import type { BusinessInput, ReportResponse } from './types';
import { ReportDisplay } from './components/ReportDisplay';


function App() {
  const [formData, setFormData] = useState<BusinessInput>({
    size: 0,
    seats: 0,
    usesGas: false,
    servesMeat: false
  });

  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<ReportResponse>('http://localhost:5001/api/report', {
        size: formData.size,
        seats: formData.seats,
        usesGas: formData.usesGas,
        servesMeat: formData.servesMeat
      });

      setReport(response.data);
    } catch (error) {
      console.error('Error:', error);
      setError('שגיאה בקבלת הדוח. אנא נסה שוב.');
    }

    setLoading(false);
  };

  const handleInputChange = (field: keyof BusinessInput, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'size' || field === 'seats' ? Number(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            מערכת רישוי עסקים
          </h1>
          <p className="text-slate-600">למסעדות ובתי אוכל</p>
        </div>

        {/* Form Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              פרטי העסק
            </CardTitle>
            <CardDescription>
              הזן את פרטי המסעדה שלך לקבלת דוח רישוי מותאם אישית
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    גודל המסעדה (מ"ר)
                  </Label>
                  <Input
                    id="size"
                    type="number"
                    placeholder="לדוגמה: 150"
                    value={formData.size || ''}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    required
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seats" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    מספר מקומות ישיבה
                  </Label>
                  <Input
                    id="seats"
                    type="number"
                    placeholder="לדוגמה: 40"
                    value={formData.seats || ''}
                    onChange={(e) => handleInputChange('seats', e.target.value)}
                    required
                    className="text-lg"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-slate-700">מאפיינים נוספים</h3>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="gas"
                    checked={formData.usesGas}
                    onCheckedChange={(checked) => handleInputChange('usesGas', checked as boolean)}
                  />
                  <Label
                    htmlFor="gas"
                    className="flex items-center gap-1 cursor-pointer font-normal"
                  >
                    <Flame className="h-4 w-4 text-orange-500" />
                    משתמש בגז למטבח
                  </Label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="meat"
                    checked={formData.servesMeat}
                    onCheckedChange={(checked) => handleInputChange('servesMeat', checked as boolean)}
                  />
                  <Label
                    htmlFor="meat"
                    className="flex items-center gap-1 cursor-pointer font-normal"
                  >
                    <Beef className="h-4 w-4 text-red-500" />
                    מגיש בשר
                  </Label>
                </div>
              </div>

              <div className="mt-6"></div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? 'מייצר דוח מותאם אישית...' : 'קבל דוח רישוי'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>שגיאה</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </CardContent>
          </Card>
        )}

        {/* Report Display */}
        {report && !loading && <ReportDisplay report={report} />}
      </div>
    </div>
  );
}

export default App;