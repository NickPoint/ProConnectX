import { useAppDispatch } from "../hooks.ts"
import { addFab, clearFabs } from "../../features/fab/fabSlice.ts"
import { useLocation } from "react-router-dom"
import {
  ProfileStatus,
  ProfileType,
  useGetCurrentUserQuery,
} from "../../features/api/pcxApi.ts"
import { useEffect } from "react"

const FabManager = () => {
  const dispatch = useAppDispatch()
  const { data: user } = useGetCurrentUserQuery()
  const location = useLocation()

  const userIsUnverified= user?.activeProfile?.status !== ProfileStatus.Active

  useEffect(() => {
    dispatch(clearFabs())

    if (!user || userIsUnverified) return;

    const isServicesPage = /\/services$/.test(location.pathname);
    if (
      isServicesPage && user.activeProfile.profileType === ProfileType.Freelancer
    ) {
      dispatch(
        addFab({ id: "addService", fabProps: {}, visible: true, icon: "add" }),
      )
    }
  }, [dispatch, user, user?.roles, location.pathname])

  return null
}

export default FabManager