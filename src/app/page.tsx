import IntroLoader from '@/components/IntroLoader'
import Hero from '@/components/Hero'
import AtlasEntry from '@/components/AtlasEntry'
import FragmentArchive from '@/components/FragmentArchive'
import SignalSection from '@/components/SignalSection'
import Footer from '@/components/Footer'

export default function Page() {
  return (
    <main style={{ background: 'var(--paper)' }}>
      <IntroLoader />
      <Hero />

      {/* Atlas entries */}
      <section>
        <AtlasEntry
          number="001"
          title="The Origin Territory"
          body="A place recorded through wind, pollen, and soft terrain. Its borders were never drawn. They were only felt."
          imageSrc="https://static.wixstatic.com/media/62f926_4b6f96b79a1945b5a123fcc30afcaa56~mv2.png"
          imageAlt="The Origin Territory — pollen-soft landscape"
          caption="IMAGE RECORD 001 — THE ORIGIN TERRITORY"
          layout="left"
          isFirst
        />
        <AtlasEntry
          number="002"
          title="The Pale Valley"
          body="A quiet place between memory and geography. Nothing here is fixed, but everything feels mapped."
          imageSrc="https://static.wixstatic.com/media/62f926_647d111a63184f2ba532fa538b3a774d~mv2.png"
          imageAlt="The Pale Valley — soft terrain between memory and map"
          caption="IMAGE RECORD 002 — THE PALE VALLEY"
          layout="right"
        />
        <AtlasEntry
          number="003"
          title="The Floating Cartography"
          body="Fragments of terrain suspended between image and map. A geography without origin, scale, or destination."
          imageSrc="https://static.wixstatic.com/media/62f926_aac47c94dd8e4000982b074f69464261~mv2.png"
          imageAlt="The Floating Cartography — terrain suspended between image and map"
          caption="IMAGE RECORD 003 — THE FLOATING CARTOGRAPHY"
          layout="left"
        />
      </section>

      <FragmentArchive />
      <SignalSection />
      <Footer />
    </main>
  )
}
