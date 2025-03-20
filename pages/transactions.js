import Credits from '../components/credits'
import LandingLayout from '../components/landing-layout'

const Page = () => {
  return <Credits />
}

Page.getLayout = function getLayout(page) {
  return <LandingLayout>{page}</LandingLayout>
}

export default Page
