import { redirect } from 'next/navigation';

// Gamla diagramsidan är uppdelad på tre flikar i huvudmenyn.
export default function DiagramRedirect() {
  redirect('/ansokningar');
}
