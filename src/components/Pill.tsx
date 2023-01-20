function Pill({
  children,
  className,
}: {
  children: React.ReactElement
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20 mb-6 inline-block ${className}`}
    >
      <span className="text-gray-600">{children}</span>
    </div>
  )
}

export default Pill
