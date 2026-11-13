'use client';
import {useState, type ComponentProps} from 'react';
import {Eye,EyeOff} from 'lucide-react';
import {Input} from './input';
export function PasswordInput({className='',floatingLabel,...props}:Omit<ComponentProps<typeof Input>,'type'>&{floatingLabel?:string}){
 const[visible,setVisible]=useState(false);
 return <div className="relative group"><Input {...props} type={visible?'text':'password'} className={`${className} pr-14`}/>{floatingLabel&&<label htmlFor={props.id} className="absolute left-3 top-3.5 text-muted-foreground transition-all duration-300 transform peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-muted-foreground peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs">{floatingLabel}</label>}<button type="button" aria-label={visible?'Passwort verbergen':'Passwort anzeigen'} aria-pressed={visible} onClick={()=>setVisible(value=>!value)} disabled={props.disabled} className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-3 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50">{visible?<EyeOff aria-hidden="true" className="h-5 w-5"/>:<Eye aria-hidden="true" className="h-5 w-5"/>}</button></div>;
}
