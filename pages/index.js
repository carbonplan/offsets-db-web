import Projects from '../components/projects'
import LandingLayout from '../components/landing-layout'

const Page = () => {
  return <Projects />
}

Page.getLayout = function getLayout(page) {
  return <LandingLayout>{page}</LandingLayout>
}

export default Page
