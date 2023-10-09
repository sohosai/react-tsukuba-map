import {GuidanceService, LatLngTuple, Route} from "../types";
import {useCallback, useState} from "react";

type ReturnType = {
  guidanceService: GuidanceService;
};

/**
 * 経路案内サービス
 */
export default function useGuidanceService(): ReturnType {
  const [isGuidanceMode, setIsGuidanceMode] = useState<boolean>(false);
  const [route, setRoute] = useState<Route | null>(null);

  const beginGuidanceMode = useCallback(async (destLocation: LatLngTuple) => {
    setIsGuidanceMode(true);
  }, [isGuidanceMode, route]);

  const stopGuidanceMode = useCallback(() => {
    setIsGuidanceMode(false);
  }, [isGuidanceMode, route]);

  return {
    guidanceService: {
      route, beginGuidanceMode, stopGuidanceMode, isGuidanceMode
    }
  };
}