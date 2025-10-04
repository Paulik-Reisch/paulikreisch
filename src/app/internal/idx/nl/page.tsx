
import { AdminDashboard } from "@/components/admin/dashboard";


export default async function NewsletterManagerPage() {
    return (
         <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-medium text-gray-900">Newsletter Management (IDX-NL)</h1>
                <p className="text-sm text-gray-500 mt-1">Erstellen, bearbeiten und verwalten Sie alle Ihre Newsletter und Kampagnen.</p>
            </header>
            
            <div className="bg-white rounded-lg p-0 md:p-6 md:border">
                 <AdminDashboard defaultTab="newsletters" />
            </div>
        </div>
    );
}
