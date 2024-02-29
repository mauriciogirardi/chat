type MessagingLogoProps = {
  color?: string
  className?: string
}

export function MessagingLogo({
  color = '#7c3aed',
  className,
}: MessagingLogoProps) {
  return (
    <svg viewBox="0 0 500 500" className={className}>
      <circle cx="257.9" cy="246.02" r="12.9" style={{ fill: color }} />
      <circle cx="302.3" cy="246.02" r="12.9" style={{ fill: color }} />
      <path
        d="M388.16 179.27a2.73 2.73 0 0 1 .76-.05 10.48 10.48 0 0 1 2.23.25 12.17 12.17 0 0 1 3.47 1.3 12.82 12.82 0 0 1 3.88 3.35 12.68 12.68 0 0 1 2.55 6 14 14 0 0 1 .16 1.85v5.88l.15 19.08.25 51.74q0 7.51.06 15.5v14.34a15.68 15.68 0 0 1-.2 2.26 13.65 13.65 0 0 1-13 11.4l-18.22.06 1.08-1-3.72 40.38-.2 2.19-1.7-1.4-48.91-40.3.8.28-100.22.05h-25.91a13.79 13.79 0 0 1-10.94-5.82 14.09 14.09 0 0 1-2.15-4.61 18.27 18.27 0 0 1-.45-4.9v-27.31c0-24 .05-47.1.07-69.13v-8.2a14.48 14.48 0 0 1 .55-4.35 14.16 14.16 0 0 1 1.87-4 13.82 13.82 0 0 1 6.83-5.21 13.29 13.29 0 0 1 4.23-.77h3.95l30.36.06 54.49.16 78.91.41 21.45.25 5.58.13a10.64 10.64 0 0 1 1.9.13 9.54 9.54 0 0 1-1.9.13l-5.58.13-21.45.25-78.91.41-54.49.16-30.36.06h-3.9a10.9 10.9 0 0 0-3.52.65 11.49 11.49 0 0 0-5.65 4.34 11.75 11.75 0 0 0-2 7v8.2c0 22 .05 45.15.08 69.13v27.31a15.31 15.31 0 0 0 .38 4.26 11.3 11.3 0 0 0 8.57 8.23 12.06 12.06 0 0 0 2.08.25H217.5l100.22.05h.45l.35.29 48.8 40.43-1.91.79 3.89-40.36.09-1h19.16a11.61 11.61 0 0 0 11.1-9.65 13.71 13.71 0 0 0 .17-1.93v-14.34q0-8 .06-15.5l.25-51.74.15-19.08v-5.88a14.13 14.13 0 0 0-.11-1.74 12.12 12.12 0 0 0-2.27-5.69 12.4 12.4 0 0 0-3.61-3.31 12.56 12.56 0 0 0-3.3-1.41c-1.8-.4-2.83-.34-2.83-.44Z"
        style={{ fill: color }}
      />
      <path
        d="M110.65 243.47h194.78a13.4 13.4 0 0 1 13.4 13.4v105.06a13.4 13.4 0 0 1-13.4 13.4H110.65a13.39 13.39 0 0 1-13.39-13.39V256.87a13.39 13.39 0 0 1 13.39-13.4Z"
        style={{ fill: color }}
      />
      <path d="m232.04 371.11 52.39 46.52 4.3-45.69" style={{ fill: color }} />
      <circle cx="166.32" cy="311.26" r="12.9" style={{ fill: '#fff' }} />
      <circle cx="210.72" cy="311.26" r="12.9" style={{ fill: '#fff' }} />
      <circle cx="255.12" cy="311.26" r="12.9" style={{ fill: '#fff' }} />
      <path
        d="m310.56 244-20.82-.61h-161c13.38 13.31 32.51 20.43 51.3 22.07s37.68-1.22 56.27-4.44 37.26-6.82 56.13-6.68c4 0 8.11.2 11.81-1.28s6.86-5.06 6.31-9.06Z"
        style={{ opacity: '0.30000000000000004' }}
      />
      <circle cx="346.7" cy="246.02" r="12.9" style={{ fill: color }} />
    </svg>
  )
}
