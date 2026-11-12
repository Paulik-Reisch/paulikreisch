import {getAuthors} from "@/lib/firestore";
import {AuthorsAdminView} from "./authors-view";
export default async function AuthorsAdminPage(){return <AuthorsAdminView authors={await getAuthors()}/>;}
