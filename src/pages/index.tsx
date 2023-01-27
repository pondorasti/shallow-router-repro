import Head from "next/head"
import { useRouter } from "next/router"
import { memo, useId } from "react"

const Boogeyman = () => {
  const id = useId()
  const [drone, setDrone] = useSyncedState<"huey" | "dewey" | "louie">("drone", "huey")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDrone(e.target.value as "huey" | "dewey" | "louie")
  }

  console.log("Boogeyman Rendered")

  return (
    <div style={{}}>
      <h1>Boogeyman {id}</h1>

      <fieldset>
        <legend>Devilish Radio Buttons</legend>

        <div>
          <input
            type="radio"
            id="huey"
            name="drone"
            value="huey"
            checked={drone === "huey"}
            onChange={handleChange}
          />
          <label htmlFor="huey">Huey</label>
        </div>

        <div>
          <input
            type="radio"
            id="dewey"
            name="drone"
            value="dewey"
            checked={drone === "dewey"}
            onChange={handleChange}
          />
          <label htmlFor="dewey">Dewey</label>
        </div>

        <div>
          <input
            type="radio"
            id="louie"
            name="drone"
            value="louie"
            checked={drone === "louie"}
            onChange={handleChange}
          />
          <label htmlFor="louie">Louie</label>
        </div>
      </fieldset>
    </div>
  )
}

const MemoizedPrincess = memo(() => {
  const id = useId()

  console.log("Memoized Princess Rendered")

  return (
    <div>
      <h1>Memoized Princess {id}</h1>
      <p>
        I&apos;m a cozy memoized component. I should not be re-rendered when the radio buttons are
        clicked.
      </p>
    </div>
  )
})
MemoizedPrincess.displayName = "MemoizedPrincess"

const Sloth = () => {
  const id = useId()

  console.log("Sloth Rendered")

  return (
    <div>
      <h1>Sloth {id}</h1>
      <p>I&apos;m a lazy component. I don&apos;t care about what&apos;s going on.</p>
    </div>
  )
}

export default function Home() {
  const id = useId()

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <h1>Shallow Router Repro {id}</h1>

        <Boogeyman />
        <MemoizedPrincess />
        <Sloth />
      </main>
    </>
  )
}

export const useSyncedState = <T extends string | string[] = string>(
  key: string,
  defaultValue: T,
  parse?: (val: string | string[]) => T,
  toString: (val: T) => string = String
): [T, (value: T | ((val: T) => T)) => void] => {
  const router = useRouter()

  const storedValue = (() => {
    const cachedValue = router.query[key]
    let currentValue: T
    if (cachedValue && parse) currentValue = parse(cachedValue)
    if (cachedValue) currentValue = cachedValue as T
    else currentValue = defaultValue

    return currentValue
  })()

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value

    const url = new URL(window.location.href)
    if (valueToStore === undefined) {
      url.searchParams.delete(key)
    } else {
      url.searchParams.set(key, toString(valueToStore))
    }

    router.push(url, undefined, { shallow: false, scroll: false })
  }

  return [storedValue, setValue]
}
