import { TopInfoBar } from './TopInfoBar'
import { BrandHeader } from './BrandHeader'
import { Navbar } from './Navbar'

export function Header() {
  return (
    <header className="w-full flex flex-col">
      <TopInfoBar />
      <BrandHeader />
      <Navbar />
    </header>
  )
}
