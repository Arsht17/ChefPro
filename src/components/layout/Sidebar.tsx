import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Icon, type IconName } from '../ui/Icon'

interface NavItem {
  to: string
  label: string
  icon: IconName
}

/* Grouping and order come from the IA frame: MENU then ACCOUNT. */
const MENU: NavItem[] = [
  { to: '/', label: 'Home', icon: 'navHome' },
  { to: '/discovery', label: 'Chef Discovery', icon: 'navDiscovery' },
  { to: '/academy', label: 'Chef Academy', icon: 'navAcademy' },
  { to: '/collection', label: 'My Collection', icon: 'navCollection' },
  { to: '/recent', label: 'Recently Viewed', icon: 'navRecent' },
]

const ACCOUNT: NavItem[] = [
  { to: '/plan', label: 'Your Plan', icon: 'navPlan' },
  { to: '/settings', label: 'Settings', icon: 'navSettings' },
]

function NavGroup({
  title,
  items,
  collapsed,
}: {
  title: string
  items: NavItem[]
  collapsed: boolean
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* The collapsed rail keeps the full MENU / ACCOUNT labels - Figma's
          "min" variant shows them, only the nav item labels disappear. */}
      <span
        className={`text-body-xs font-bold tracking-[1.2px] text-text uppercase ${
          collapsed ? 'self-center text-[10px] tracking-[1px]' : ''
        }`}
      >
        {title}
      </span>
      {/* Collapsed, each item is a fixed 48px pill inside a wider list, so the
          list has to centre them - otherwise they hug the left edge while the
          MENU / ACCOUNT labels sit centred, and the group looks crooked. */}
      <ul
        className={`flex w-full flex-col gap-2 ${collapsed ? 'items-center' : ''}`}
      >
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-[24px] p-3 transition-colors duration-200',
                  collapsed ? 'w-12 justify-center' : 'w-full',
                  // Primary for the current page, Primary-hover on hover -
                  // the two reds the design system distinguishes.
                  isActive
                    ? 'bg-primary text-text-inverse'
                    : 'text-text hover:bg-primary-hover hover:text-text-inverse',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={item.icon} size={24} />
                  {!collapsed && (
                    <span className="text-body-s font-semibold whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                  {isActive && <span className="sr-only">(current page)</span>}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

const PLUS_BENEFITS = [
  'Access lessons from 0-1 Michelin star chefs',
  'Exclusive chef techniques and recipes',
  'Live cooking masterclasses',
  'Advanced skill analytics',
]

/**
 * The rail runs the full height of the viewport under the header, and expands
 * on hover as well as on click. `collapsed` is the pinned preference; hovering
 * (or tabbing into it) previews the expanded state without changing it, which
 * is why the width is driven by `expanded` rather than by the prop directly.
 */
export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const [peeking, setPeeking] = useState(false)
  const expanded = !collapsed || peeking

  return (
    <nav
      aria-label="Main"
      onMouseEnter={() => setPeeking(true)}
      onMouseLeave={() => setPeeking(false)}
      onFocusCapture={() => setPeeking(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setPeeking(false)
        }
      }}
      className={`no-scrollbar flex h-full shrink-0 flex-col justify-between overflow-x-hidden overflow-y-auto rounded-r-[24px] bg-white p-6 transition-[width] duration-300 ease-out ${
        expanded ? 'w-[320px]' : 'w-[117px]'
      }`}
    >
      <div className="flex flex-col items-center gap-10">
        <NavGroup title="Menu" items={MENU} collapsed={!expanded} />
        <NavGroup title="Account" items={ACCOUNT} collapsed={!expanded} />
      </div>

      {/* Fixed width so the card renders at full size the instant the rail
          expands, instead of reflowing along with the width transition. */}
      <div className={`mt-10 ${expanded ? 'w-[272px]' : 'w-full'}`}>
        {!expanded ? (
          <div className="flex flex-col items-center gap-2 rounded-[12px] border border-stroke bg-bg-02 p-[7px]">
            <p className="text-center text-[10px] leading-3 font-semibold text-text">
              Plus
              <br />
              <span className="text-[8px]">Membership</span>
            </p>
            <span className="w-full rounded-[24px] bg-primary py-0.5 text-center text-[8px] font-bold text-text-inverse uppercase">
              Active
            </span>
          </div>
        ) : (
          <div className="rounded-[12px] border border-stroke bg-bg-02 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-heading-xs font-semibold text-text">
                Plus Membership
              </p>
              <span className="rounded-[24px] bg-primary px-2 py-0.5 text-[8px] font-bold text-text-inverse uppercase">
                Active
              </span>
            </div>
            <ul className="flex flex-col gap-2">
              {PLUS_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-numeral text-[9px] leading-none text-numeral"
                  >
                    &#10003;
                  </span>
                  <span className="text-body-xs text-text">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}
