// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/no-process-exit */

// https://gist.github.com/nfantone/1eaa803772025df69d07f4dbf5df7e58

import { logger } from "~util/log";

type BeforeShutdownListener = (signalOrEvent: string) => unknown;

/**
 * System signals the app will listen to initiate shutdown.
 * @const {string[]}
 */
const SHUTDOWN_SIGNALS = ["SIGINT", "SIGTERM"];

/**
 * Time in milliseconds to wait before forcing shutdown.
 * @const {number}
 */
const SHUTDOWN_TIMEOUT = 15_000;

/**
 * A queue of listener callbacks to execute before shutting
 * down the process.
 * @type {BeforeShutdownListener[]}
 */
const shutdownListeners: BeforeShutdownListener[] = [];

/* eslint-disable unicorn/no-array-for-each */

/**
 * Listen for signals and execute given `fn` function once.
 * @param  {string[]} signals System signals to listen to.
 * @param  {function(string)} fn Function to execute on shutdown.
 */
const processOnce = (
	signals: string[],
	function_: (argument0: string) => unknown
) => signals.forEach((sig) => process.once(sig, function_));

/* eslint-enable unicorn/no-array-for-each */

/**
 * Sets a forced shutdown mechanism that will exit the process after `timeout` milliseconds.
 * @param {number} timeout Time to wait before forcing shutdown (milliseconds)
 */
const forceExitAfter = (timeout: number) => () => {
	setTimeout(() => {
		// Force shutdown after timeout
		logger.warn(
			"Shutdown timed out after %dms, forcing exit with error code",
			timeout
		);
		return process.exit(1);
	}, timeout).unref();
};

/**
 * Main process shutdown handler. Will invoke every previously registered async shutdown listener
 * in the queue and exit with a code of `0`. Any `Promise` rejections from any listener will
 * be logged out as a warning, but won't prevent other callbacks from executing.
 * @param {string} signalOrEvent The exit signal or event name received on the process.
 */
async function shutdownHandler(signalOrEvent: string) {
	logger.debug("Shutting down: received %s signal", signalOrEvent);

	for (const listener of shutdownListeners) {
		try {
			// eslint-disable-next-line no-await-in-loop -- each listener needs to wait one after another
			await listener(signalOrEvent);
		} catch (error) {
			logger.warn(error, "A shutdown handler failed");
		}
	}

	return process.exit(0);
}

/**
 * Registers a new shutdown listener to be invoked before exiting
 * the main process. Listener handlers are guaranteed to be called in the order
 * they were registered.
 * @param {BeforeShutdownListener} listener The shutdown listener to register.
 * @returns {BeforeShutdownListener} Echoes back the supplied `listener`.
 */
function beforeShutdown(
	listener: BeforeShutdownListener
): BeforeShutdownListener {
	shutdownListeners.push(listener);
	return listener;
}

// Register shutdown callback that kills the process after `SHUTDOWN_TIMEOUT` milliseconds
// This prevents custom shutdown handlers from hanging the process indefinitely
processOnce(SHUTDOWN_SIGNALS, forceExitAfter(SHUTDOWN_TIMEOUT));

// Register process shutdown callback
// Will listen to incoming signal events and execute all registered handlers in the stack
processOnce(SHUTDOWN_SIGNALS, shutdownHandler);

export { beforeShutdown };
