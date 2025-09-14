import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    AlertCircle,
    CheckCircle2,
    Building2,
    Users,
    Flame,
    Package,
    FileText,
    Download,
    Printer,
    Clock,
    DollarSign,
    Lightbulb,
    AlertTriangle
} from 'lucide-react';
import type { ReportResponse, StructuredReport } from '@/types';

interface ReportDisplayProps {
    report: ReportResponse;
}

export function ReportDisplay({ report }: ReportDisplayProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `דוח רישוי עסק - ${new Date().toLocaleDateString('he-IL')}`,
        pageStyle: `
            @page {
                size: A4;
                margin: 1in;
                @top-center {
                    content: "דוח רישוי עסק למסעדה";
                    font-size: 14pt;
                    font-weight: bold;
                }
            }
            @media print {
                body { -webkit-print-color-adjust: exact !important; }
                .page-break { page-break-before: always; }
            }
        `,
        onPrintError: (error) => console.error('Print error:', error),
    });

    // Check if report is structured or string
    const isStructuredReport = (report: string | StructuredReport): report is StructuredReport => {
        return typeof report === 'object' && report !== null;
    };

    // Render structured report
    const renderStructuredReport = (structuredReport: StructuredReport) => {
        return (
            <div className="space-y-6">
                {/* Summary */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg print:bg-white print:border-2">
                    <h3 className="font-bold text-blue-900 mb-2">סיכום</h3>
                    <p className="text-blue-800">{structuredReport.summary}</p>
                </div>

                {/* Cost and Time Overview */}
                {(structuredReport.total_estimated_cost || structuredReport.total_estimated_days) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {structuredReport.total_estimated_cost && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                                <div className="text-2xl font-bold text-green-700">
                                    ₪{structuredReport.total_estimated_cost.min.toLocaleString()} - ₪{structuredReport.total_estimated_cost.max.toLocaleString()}
                                </div>
                                <div className="text-sm text-green-600">עלות משומערת</div>
                                {structuredReport.total_estimated_cost.notes && (
                                    <div className="text-xs text-green-600 mt-1">{structuredReport.total_estimated_cost.notes}</div>
                                )}
                            </div>
                        )}
                        {structuredReport.total_estimated_days && (
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                                <Clock className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                                <div className="text-2xl font-bold text-purple-700">
                                    {structuredReport.total_estimated_days} ימים
                                </div>
                                <div className="text-sm text-purple-600">זמן משומער</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Requirements */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-300 pb-2">
                        דרישות מפורטות ({structuredReport.requirements.length})
                    </h3>
                    {structuredReport.requirements.map((req, index) => (
                        <div key={req.id} className="border border-slate-200 rounded-lg p-6 bg-white">
                            <div className="flex items-start gap-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex-shrink-0">
                                    {index + 1}
                                </span>
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-bold text-slate-900">{req.title}</h4>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            req.importance === 'קריטי' ? 'bg-red-100 text-red-700' :
                                            req.importance === 'חשוב' ? 'bg-amber-100 text-amber-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {req.importance}
                                        </span>
                                        <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">
                                            {req.category}
                                        </span>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            הסבר בעברית פשוטה
                                        </h5>
                                        <p className="text-blue-800 text-sm">{req.plain_explanation}</p>
                                    </div>

                                    {req.practical_tips && req.practical_tips.length > 0 && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                            <h5 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                                                <Lightbulb className="h-4 w-4" />
                                                טיפים מעשיים
                                            </h5>
                                            <ul className="space-y-1">
                                                {req.practical_tips.map((tip, tipIndex) => (
                                                    <li key={tipIndex} className="text-amber-800 text-sm flex items-start gap-2">
                                                        <span className="text-amber-600 mt-1">•</span>
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <DollarSign className="h-4 w-4 text-green-600" />
                                                <span className="font-semibold text-green-900 text-sm">עלות</span>
                                            </div>
                                            <div className="text-green-800 font-bold">
                                                ₪{req.estimated_cost.min.toLocaleString()} - ₪{req.estimated_cost.max.toLocaleString()}
                                            </div>
                                            {req.estimated_cost.notes && (
                                                <div className="text-xs text-green-600 mt-1">{req.estimated_cost.notes}</div>
                                            )}
                                        </div>

                                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Clock className="h-4 w-4 text-purple-600" />
                                                <span className="font-semibold text-purple-900 text-sm">זמן</span>
                                            </div>
                                            <div className="text-purple-800 font-bold">{req.estimated_time_days} ימים</div>
                                        </div>

                                        {req.required_professionals && req.required_professionals.length > 0 && (
                                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Users className="h-4 w-4 text-slate-600" />
                                                    <span className="font-semibold text-slate-900 text-sm">נדרשים</span>
                                                </div>
                                                <div className="text-slate-800 text-sm">
                                                    {req.required_professionals.join(', ')}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Next Steps */}
                {structuredReport.next_steps && structuredReport.next_steps.length > 0 && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            השלבים הבאים
                        </h3>
                        <ol className="space-y-2">
                            {structuredReport.next_steps.map((step, index) => (
                                <li key={index} className="text-blue-800 flex items-start gap-3">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-200 text-blue-800 font-bold text-sm flex-shrink-0">
                                        {index + 1}
                                    </span>
                                    {step}
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {/* Important Notes */}
                {structuredReport.important_notes && structuredReport.important_notes.length > 0 && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                        <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            הערות חשובות
                        </h3>
                        <ul className="space-y-2">
                            {structuredReport.important_notes.map((note, index) => (
                                <li key={index} className="text-amber-800 flex items-start gap-2">
                                    <span className="text-amber-600 mt-1 flex-shrink-0">•</span>
                                    {note}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    // Clean and format the report text
    const formatReportText = (text: string) => {
        const lines = text.split('\n');
        const formatted: React.ReactElement[] = [];

        lines.forEach((line, idx) => {
            // Skip empty lines
            if (!line.trim()) {
                formatted.push(<div key={idx} className="h-2" />);
                return;
            }

            // Main headers with ##
            if (line.startsWith('##')) {
                formatted.push(
                    <h2 key={idx} className="text-xl font-bold text-slate-900 mt-6 mb-4 print:mt-4">
                        {line.replace(/##/g, '').trim()}
                    </h2>
                );
                return;
            }

            // Section headers with **text:**
            if (line.includes('**') && line.includes(':**')) {
                const cleaned = line.replace(/\*\*/g, '').replace(':', '');
                formatted.push(
                    <div key={idx} className="mt-6 mb-3 print:mt-4">
                        <h3 className="text-lg font-bold text-slate-800">
                            {cleaned}
                        </h3>
                        <Separator className="mt-2" />
                    </div>
                );
                return;
            }

            // Numbered items (main requirements)
            if (/^[0-9]+\./.test(line.trim())) {
                const number = line.match(/^([0-9]+)\./)?.[1];
                const content = line.replace(/^[0-9]+\./, '').trim();

                formatted.push(
                    <div key={idx} className="my-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 print:bg-white print:border-2">
                        <div className="flex items-start gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">
                                {number}
                            </span>
                            <div className="flex-1">
                                <p className="font-medium text-slate-800">{content}</p>
                            </div>
                        </div>
                    </div>
                );
                return;
            }

            // Bullet points with specific formatting
            if (line.trim().startsWith('*') && !line.includes('**')) {
                const content = line.trim().substring(1).trim();
                let icon = <AlertCircle className="h-4 w-4 text-gray-600" />;
                let bgClass = 'bg-gray-50 border-gray-200';
                let textClass = 'text-gray-700';

                // Detect type by content
                if (content.includes('עלות') || content.includes('₪')) {
                    icon = <DollarSign className="h-4 w-4 text-green-600" />;
                    bgClass = 'bg-green-50 border-green-200';
                    textClass = 'text-green-800';
                } else if (content.includes('זמן') || content.includes('שבוע') || content.includes('ימים')) {
                    icon = <Clock className="h-4 w-4 text-purple-600" />;
                    bgClass = 'bg-purple-50 border-purple-200';
                    textClass = 'text-purple-800';
                } else if (content.includes('טיפ') || content.includes('המלצה')) {
                    icon = <Lightbulb className="h-4 w-4 text-amber-600" />;
                    bgClass = 'bg-amber-50 border-amber-200';
                    textClass = 'text-amber-800';
                } else if (content.includes('עברית פשוטה') || content.includes('הסבר')) {
                    icon = <FileText className="h-4 w-4 text-blue-600" />;
                    bgClass = 'bg-blue-50 border-blue-200';
                    textClass = 'text-blue-800';
                }

                formatted.push(
                    <div key={idx} className={`my-2 p-3 rounded-lg border ${bgClass} print:border print:bg-white`}>
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex-shrink-0">{icon}</span>
                            <p className={`text-sm flex-1 ${textClass}`}>{content}</p>
                        </div>
                    </div>
                );
                return;
            }

            // Bold text inline
            if (line.includes('**')) {
                const parts = line.split('**');
                formatted.push(
                    <p key={idx} className="my-2 text-slate-700 leading-relaxed">
                        {parts.map((part, i) =>
                            i % 2 === 1 ?
                                <strong key={i} className="font-bold text-slate-900">{part}</strong> :
                                part
                        )}
                    </p>
                );
                return;
            }

            // Separators
            if (line.includes('---')) {
                formatted.push(<Separator key={idx} className="my-4 print:my-2" />);
                return;
            }

            // Regular paragraphs
            formatted.push(
                <p key={idx} className="my-2 text-slate-700 leading-relaxed">
                    {line}
                </p>
            );
        });

        return formatted;
    };

    return (
        <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex gap-2 justify-end print:hidden">
                <Button
                    onClick={handlePrint}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <Printer className="h-4 w-4" />
                    הדפס דוח
                </Button>
                <Button
                    onClick={() => handlePrint()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                    <Download className="h-4 w-4" />
                    הורד כ-PDF
                </Button>
            </div>

            <div ref={printRef} className="space-y-6">
                {/* Header for print */}
                <div className="hidden print:block text-center mb-6">
                    <h1 className="text-2xl font-bold">דוח רישוי עסק למסעדה</h1>
                    <p className="text-sm text-gray-600 mt-2">
                        תאריך: {new Date().toLocaleDateString('he-IL')}
                    </p>
                </div>

                {/* Summary Card */}
                <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 print:border print:bg-white">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-green-800 text-lg">
                            <CheckCircle2 className="h-6 w-6 print:hidden" />
                            סיכום דוח רישוי
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-green-100 print:border">
                                <div className="text-3xl font-bold text-green-700 mb-1">{report.relevant_regulations}</div>
                                <div className="text-sm text-gray-600 font-medium">דרישות רלוונטיות</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 print:border">
                                <div className="text-3xl font-bold text-gray-700 mb-1">{report.total_regulations}</div>
                                <div className="text-sm text-gray-600 font-medium">סה״כ דרישות</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-blue-100 print:border">
                                <Building2 className="h-6 w-6 mx-auto mb-2 text-blue-600 print:hidden" />
                                <div className="text-2xl font-bold text-blue-700 mb-1">{report.user_input.size} מ״ר</div>
                                <div className="text-sm text-gray-600 font-medium">שטח</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-purple-100 print:border">
                                <Users className="h-6 w-6 mx-auto mb-2 text-purple-600 print:hidden" />
                                <div className="text-2xl font-bold text-purple-700 mb-1">{report.user_input.seats}</div>
                                <div className="text-sm text-gray-600 font-medium">מקומות ישיבה</div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-center flex-wrap">
                            {report.user_input.usesGas && (
                                <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1 text-sm print:border print:bg-white">
                                    <Flame className="h-4 w-4" />
                                    משתמש בגז למטבח
                                </Badge>
                            )}
                            {report.user_input.servesMeat && (
                                <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1 text-sm print:border print:bg-white">
                                    <Package className="h-4 w-4" />
                                    מגיש בשר
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Main Report Content */}
                <Card className="print:border-0 print:shadow-none border-slate-200">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-200 print:bg-white print:border-b-2">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <FileText className="h-6 w-6 text-blue-600 print:hidden" />
                            פירוט הדרישות וההמלצות
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 print:p-6">
                        <div className="max-w-none space-y-4">
                            {isStructuredReport(report.report) ?
                                renderStructuredReport(report.report) :
                                formatReportText(report.report)
                            }
                        </div>
                    </CardContent>
                </Card>

                {/* Raw Regulations */}
                <Card className="border-slate-200 bg-slate-50/50 print:bg-white page-break">
                    <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600 print:hidden" />
                            דרישות גולמיות מהחוק ({report.raw_regulations?.length || 0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {report.raw_regulations?.map((reg, index) => (
                                <div key={reg.id} className="bg-white p-4 rounded-lg border border-slate-200">
                                    <div className="flex items-start gap-3">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-sm font-bold flex-shrink-0">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-700 mb-2">{reg.hebrew_text}</p>
                                            <div className="flex gap-2 flex-wrap">
                                                <Badge variant="outline" className="text-xs">
                                                    {reg.category === 'health' ? 'בריאות' :
                                                        reg.category === 'fire_safety' ? 'כיבוי אש' :
                                                            reg.category}
                                                </Badge>
                                                {reg.priority === 'critical' && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        קריטי
                                                    </Badge>
                                                )}
                                                <Badge variant="secondary" className="text-xs">
                                                    עמוד {reg.source_page}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}