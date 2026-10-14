import ShineCard from './ShineCard'
import type { Ally } from '@/lib/site'

/** One ally: logo on its white (or black) card, caption under it. `logo` is the resolved /aliados path. */
export default function AllyTile({ ally: a, logo }: { ally: Ally; logo: string | null }) {
  return (
    <>
      {/* Glint only, no tilt: these tiles also ride the conveyor. */}
      <ShineCard tilt={false} radius="rounded-2xl" className="w-full">
        {logo ? (
          <div
            className={`flex aspect-[3/2] w-full items-center justify-center rounded-2xl ${
              a.tileColor ? '' : a.tileBg === 'black' ? 'bg-black' : 'bg-white'
            } ${a.wideLogo ? 'px-3 py-4' : 'p-5'}`}
            style={a.tileColor ? { backgroundColor: a.tileColor } : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- ally logos, mixed formats */}
            <img src={logo} alt={`Logotipo de ${a.name}`} className="h-full w-full object-contain" />
          </div>
        ) : (
          <div className="glass-strong flex aspect-[3/2] w-full items-center justify-center rounded-2xl p-5">
            <span className="font-display text-[15px] font-semibold leading-tight text-white">{a.name}</span>
          </div>
        )}
      </ShineCard>
      {/* Every ally gets its name under the logo; long names wrap. A name-only tile already shows it inside. */}
      {logo && (
        <span className="mt-4 max-w-full text-center text-[11px] uppercase leading-snug tracking-[0.2em] text-balance break-words text-peri/65">
          {a.name}
        </span>
      )}
      {a.years && <span className="mt-1 text-[11px] tracking-[0.15em] text-white/50">{a.years}</span>}
    </>
  )
}
