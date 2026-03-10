import AuthOverlay from "../../../components/authOverlay/authOverlay"

function Profile() {
  return (
    
    <div className="h-screen overflow-y-auto flex sm:items-center justify-between">

      <div className="scroll flex items-center justify-center 2xl:w-[54.375%] xl:w-[55%] md:w-[55%] h-screen overflow-y-auto w-full md:px-0 px-6">

        <div className="2xl:w-[600px] sm:w-[460px] py-[15%] md:mx-0 mx-auto h-full w-full">
          <div className="relative flex flex-col justify-center 2xl:gap-12 gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-[24px] text-center">Set Up Your Profile</h1>
              <p className="text-[#7C7E7E] font-medium text-center">Help us know you better to personalize your experience</p>
            </div>
            {/* Profile Form Goes Here */}
          </div>
        </div>

      </div>
      
      <AuthOverlay />
    </div>
  )
}

export default Profile