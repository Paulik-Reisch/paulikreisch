
import { NewsletterManager } from "@/components/admin/dashboard";
import { getNewsletters } from "@/lib/firestore";
import { Newspaper } from "lucide-react";

export default async function NewsletterManagerPage() {
    const newsletters = await getNewsletters();
    
    return (
         <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-medium text-gray-900">Newsletter Management (IDX-NL)</h1>
                <p className="text-sm text-gray-500 mt-1">Erstellen, bearbeiten und verwalten Sie alle Ihre Newsletter.</p>
            </header>
            
            <div className="p-6 border bg-white rounded-lg">
                 <NewsletterManager initialNewsletters={newsletters} onTabChange={() => {}}/>
            </div>
        </div>
    );
}