export default function DemoBanner() {
  return (
    <div
      role="note"
      className="border-b"
      style={{ background: '#FFF4D6', borderColor: '#E8C35A', color: '#5C4400' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-2.5 text-sm flex items-center gap-2">
        <span aria-hidden="true" className="font-bold">⚠</span>
        <span>
          <strong>Demoversion:</strong> All data i den här applikationen är påhittad demodata och motsvarar inga verkliga ärenden, organisationer eller belopp.
        </span>
      </div>
    </div>
  );
}
