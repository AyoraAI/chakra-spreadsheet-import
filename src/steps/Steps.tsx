import { StepState, StepType, UploadFlow } from "./UploadFlow"
import { Dialog, Steps as ChakraSteps } from "@chakra-ui/react"

import { useRsi } from "../hooks/useRsi"
import { useRef, useState } from "react"
import { steps, stepTypeToStepIndex, stepIndexToStepType } from "../utils/steps"
import { CheckIcon } from "@heroicons/react/24/outline"

export const Steps = () => {
  const { initialStepState, translations, isNavigationEnabled } = useRsi()

  const initialStep = stepTypeToStepIndex(initialStepState?.type)

  const [step, setStep] = useState(initialStep)

  const [state, setState] = useState<StepState>({ type: StepType.upload })

  const history = useRef<StepState[]>([])

  const onClickStep = (stepIndex: number) => {
    const type = stepIndexToStepType(stepIndex)
    const historyIdx = history.current.findIndex((v) => v.type === type)
    if (historyIdx === -1) return
    const nextHistory = history.current.slice(0, historyIdx + 1)
    history.current = nextHistory
    setState(nextHistory[nextHistory.length - 1])
    setStep(stepIndex)
  }

  const onBack = () => {
    onClickStep(Math.max(step - 1, 0))
  }

  const onNext = (v: StepState) => {
    history.current.push(state)
    setState(v)
    if (v.type !== StepType.selectSheet) setStep(step + 1)
  }

  return (
    <>
      <Dialog.Header display={["none", "none", "block"]} bgColor="bg.muted">
        <ChakraSteps.Root
          step={step}
          onStepChange={(e) => {
            if (isNavigationEnabled) {
              onClickStep(e.step)
            }
          }}
          count={steps.length}
          colorPalette="primary"
          size="md"
        >
          <ChakraSteps.List>
            {steps.map((key, index) => (
              <ChakraSteps.Item
                key={key}
                index={index}
                title={translations[key].title}
              >
                <ChakraSteps.Indicator>
                  <ChakraSteps.Status
                    incomplete={index + 1}
                    complete={<CheckIcon />}
                  />
                </ChakraSteps.Indicator>
                <ChakraSteps.Title>{translations[key].title}</ChakraSteps.Title>
                <ChakraSteps.Separator />
              </ChakraSteps.Item>
            ))}
          </ChakraSteps.List>
        </ChakraSteps.Root>
      </Dialog.Header>
      <Dialog.Body p="0">
        <UploadFlow
          state={state}
          onNext={onNext}
          onBack={isNavigationEnabled ? onBack : undefined}
        />
      </Dialog.Body>
    </>
  )
}
