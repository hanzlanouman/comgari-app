import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

export const Backdrop = (props: any) => (
  <BottomSheetBackdrop
    {...props}
    appearsOnIndex={1}
    animatedIndex={{
      value: 1,
    }}
  />
);

export default Backdrop;