/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// ==============================
// === Type and Interface Definitions ===
// ==============================

/**
 * Set the default delimiter for repeat parameters. (default: `'/'`)
 */
export interface ParseOptions {
	delimiter?: string;
	/**
	 * List of characters to automatically consider prefixes when parsing.
	 */
	prefixes?: string;
}

export interface RegexpToFunctionOptions {
	/**
	 * Function for decoding strings for params.
	 */
	decode?: (value: string, token: Key) => string;
}

/**
 * A match result contains data about the path match.
 */
export interface MatchResult<P extends object = object> {
	path: string;
	index: number;
	params: P;
}

/**
 * A match is either `false` (no match) or a match result.
 */
export type Match<P extends object = object> = false | MatchResult<P>;

/**
 * The match function takes a string and returns whether it matched the path.
 */
export type MatchFunction<P extends object = object> = (
	path: string
) => Match<P>;

/**
 * Metadata about a key.
 */
export interface Key {
	name: string | number;
	prefix: string;
	suffix: string;
	pattern: string;
	modifier: string;
}

export interface TokensToRegexpOptions {
	/**
	 * When `true` the regexp will be case sensitive. (default: `false`)
	 */
	sensitive?: boolean;
	/**
	 * When `true` the regexp won't allow an optional trailing delimiter to match. (default: `false`)
	 */
	strict?: boolean;
	/**
	 * When `true` the regexp will match to the end of the string. (default: `true`)
	 */
	end?: boolean;
	/**
	 * When `true` the regexp will match from the beginning of the string. (default: `true`)
	 */
	start?: boolean;
	/**
	 * Sets the final character for non-ending optimistic matches. (default: `/`)
	 */
	delimiter?: string;
	/**
	 * List of characters that can also be "end" characters.
	 */
	endsWith?: string;
	/**
	 * Encode path tokens for use in the `RegExp`.
	 */
	encode?: (value: string) => string;
}

/**
 * Supported `path-to-regexp` input types.
 */
export type Path = string | RegExp | Array<string | RegExp>;

// ==============================
// === Helper Functions ===
// ==============================

type Token =
	| { type: 'MODIFIER'; index: number; value: string }
	| { type: 'ESCAPED_CHAR'; index: number; value: string }
	| { type: 'OPEN'; index: number; value: string }
	| { type: 'CLOSE'; index: number; value: string }
	| { type: 'NAME'; index: number; value: string }
	| { type: 'PATTERN'; index: number; value: string }
	| { type: 'CHAR'; index: number; value: string }
	| { type: 'END'; index: number; value: string };

/**
 * Tokenize a string path.
 *
 * @private
 */
function tokenizePath(str: string): Token[] {
	const tokens: Token[] = [];
	let i = 0;

	while (i < str.length) {
		const char = str[i];
		if (char === '*' || char === '+' || char === '?') {
			tokens.push({
				type: 'MODIFIER',
				index: i,
				value: str[i++],
			});
			continue;
		}
		if (char === '\\') {
			tokens.push({
				type: 'ESCAPED_CHAR',
				index: i++,
				value: str[i++],
			});
			continue;
		}
		if (char === '{') {
			tokens.push({
				type: 'OPEN',
				index: i,
				value: str[i++],
			});
			continue;
		}
		if (char === '}') {
			tokens.push({
				type: 'CLOSE',
				index: i,
				value: str[i++],
			});
			continue;
		}
		if (char === ':') {
			let name = '';
			let j = i + 1;
			while (j < str.length) {
				const code = str.charCodeAt(j);
				if (
					(code >= 48 && code <= 57) || // 0-9
					(code >= 65 && code <= 90) || // A-Z
					(code >= 97 && code <= 122) || // a-z
					code === 95 // _
				) {
					name += str[j++];
					continue;
				}
				break;
			}
			if (!name) {
				throw new TypeError(`Missing parameter name at ${i}`);
			}
			tokens.push({
				type: 'NAME',
				index: i,
				value: name,
			});
			i = j;
			continue;
		}
		if (char === '(') {
			let balance = 1;
			let pattern = '';
			let j = i + 1;
			if (str[j] === '?') {
				throw new TypeError(`Pattern cannot start with "?" at ${j}`);
			}
			while (j < str.length) {
				if (str[j] === '\\') {
					pattern += str[j++] + str[j++];
					continue;
				}
				if (str[j] === ')') {
					balance--;
					if (balance === 0) {
						j++;
						break;
					}
				} else if (str[j] === '(') {
					balance++;
					if (str[j + 1] !== '?') {
						throw new TypeError(`Capturing groups are not allowed at ${j}`);
					}
				}
				pattern += str[j++];
			}
			if (balance) {
				throw new TypeError(`Unbalanced pattern at ${i}`);
			}
			if (!pattern) {
				throw new TypeError(`Missing pattern at ${i}`);
			}
			tokens.push({
				type: 'PATTERN',
				index: i,
				value: pattern,
			});
			i = j;
			continue;
		}

		tokens.push({
			type: 'CHAR',
			index: i,
			value: str[i++],
		});
	}

	tokens.push({
		type: 'END',
		index: i,
		value: '',
	});
	return tokens;
}

/**
 * Parse a string path into an array of tokens.
 *
 * @private
 */
function parsePath(str: string, options: ParseOptions = {}): (string | Key)[] {
	const tokens = tokenizePath(str);
	const prefixes = options.prefixes === undefined ? './' : options.prefixes;
	const delimiters =
		options.delimiter === undefined ? '/#?' : options.delimiter;

	const result: (string | Key)[] = [];
	let i = 0;
	let path = '';

	const getNextToken = (type: Token['type']) => {
		if (i < tokens.length && tokens[i].type === type) {
			return tokens[i++].value;
		}
	};

	const expectToken = (type: Token['type']) => {
		const value = getNextToken(type);
		if (value !== undefined) {
			return value;
		}
		const token = tokens[i];
		throw new TypeError(
			`Unexpected ${token.type} at ${token.index}, expected ${type}`
		);
	};

	const getChars = () => {
		let chars = '';
		let char;
		while ((char = getNextToken('CHAR') || getNextToken('ESCAPED_CHAR'))) {
			chars += char;
		}
		return chars;
	};

	const isDelimiter = (val: string) => {
		for (const d of delimiters) {
			if (val.includes(d)) return true;
		}
		return false;
	};

	const createPattern = (prefix: string) => {
		const lastToken = result[result.length - 1];
		const prev = lastToken && typeof lastToken === 'string' ? lastToken : '';
		if (lastToken && !prev) {
			throw new TypeError(
				`Must have text between two parameters, missing text after "${
					(lastToken as Key).name
				}"`
			);
		}
		return !prev || isDelimiter(prev)
			? `[^${escapeString(delimiters)}]+?`
			: `(?:(?!${escapeString(prev)})[^${escapeString(delimiters)}])+?`;
	};

	let tokenIndex = 0;
	while (i < tokens.length) {
		const charToken = getNextToken('CHAR');
		const nameToken = getNextToken('NAME');
		const patternToken = getNextToken('PATTERN');

		if (nameToken || patternToken) {
			let prefix = charToken || '';
			if (prefixes.indexOf(prefix) === -1) {
				path += prefix;
				prefix = '';
			}
			if (path) {
				result.push(path);
				path = '';
			}
			result.push({
				name: nameToken || tokenIndex++,
				prefix: prefix,
				suffix: '',
				pattern: patternToken || createPattern(prefix),
				modifier: getNextToken('MODIFIER') || '',
			});
			continue;
		}

		const escapedCharToken = getNextToken('ESCAPED_CHAR');
		const char = charToken || escapedCharToken;
		if (char) {
			path += char;
			continue;
		}

		if (path) {
			result.push(path);
			path = '';
		}

		const openToken = getNextToken('OPEN');
		if (openToken) {
			const prefix = getChars();
			const name = getNextToken('NAME') || '';
			const pattern = getNextToken('PATTERN') || '';
			const suffix = getChars();
			expectToken('CLOSE');

			result.push({
				name: name || (pattern ? tokenIndex++ : ''),
				pattern: name && !pattern ? createPattern(prefix) : pattern,
				prefix: prefix,
				suffix: suffix,
				modifier: getNextToken('MODIFIER') || '',
			});
			continue;
		}

		expectToken('END');
	}

	return result;
}

/**
 * Escape a string for use in a `RegExp`.
 *
 * @private
 */
function escapeString(str: string) {
	return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
}

/**
 * Get the flags for a `RegExp`.
 *
 * @private
 */
function getFlags(options?: TokensToRegexpOptions) {
	return options && options.sensitive ? '' : 'i';
}

/**
 * Add a token to a `RegExp`.
 *
 * @private
 */
function attachRegExpTokens(regExp: RegExp, tokens: Key[]) {
	const source = regExp.source;
	const capturingGroups = /\((?:\?<(.*?)>)?(?!\?)/g;
	let index = 0;
	let match;
	while ((match = capturingGroups.exec(source))) {
		tokens.push({
			name: match[1] || index++,
			prefix: '',
			suffix: '',
			modifier: '',
			pattern: '',
		});
	}
	return regExp;
}

/**
 * Create a `RegExp` from a `Path` array.
 *
 * @private
 */
function createPathArrayRegExp(
	path: (string | RegExp)[],
	keys: Key[],
	options?: TokensToRegexpOptions
) {
	const sources = path.map((p) => {
		const regExp = pathToRegexp(p as Path, keys, options);
		return regExp.source;
	});
	return new RegExp(`(?:${sources.join('|')})`, getFlags(options));
}

/**
 * Create a `RegExp` from a `Path` string.
 *
 * @private
 */
function createPathStringRegExp(
	str: string,
	keys: Key[],
	options?: TokensToRegexpOptions & ParseOptions
) {
	return createRegExpFromTokens(parsePath(str, options), keys, options);
}

/**
 * Create a `RegExp` from an array of tokens.
 *
 * @private
 */
function createRegExpFromTokens(
	tokens: (string | Key)[],
	keys: Key[],
	options: TokensToRegexpOptions = {}
) {
	const {
		strict = false,
		start = true,
		end = true,
		encode = (val: string) => val,
		delimiter = '/#?',
		endsWith = '',
	} = options;

	let source = start ? '^' : '';
	const escapedDelimiters = `[${escapeString(delimiter)}]`;
	const escapedEndsWith = `[${escapeString(endsWith)}]|$`;

	for (const token of tokens) {
		if (typeof token === 'string') {
			source += escapeString(encode(token));
			continue;
		}

		const { prefix, suffix, pattern, modifier } = token;
		const escapedPrefix = escapeString(encode(prefix));
		const escapedSuffix = escapeString(encode(suffix));
		keys.push(token);

		if (pattern) {
			if (escapedPrefix || escapedSuffix) {
				if (modifier === '+' || modifier === '*') {
					const optional = modifier === '*' ? '?' : '';
					source += `(?:${escapedPrefix}((?:${pattern})(?:${escapedSuffix}${escapedPrefix}(?:${pattern}))*)${escapedSuffix})${optional}`;
				} else {
					source += `(?:${escapedPrefix}(${pattern})${escapedSuffix})${modifier}`;
				}
			} else {
				if (modifier === '+' || modifier === '*') {
					throw new TypeError(
						`Can not repeat "${token.name}" without a prefix and suffix`
					);
				}
				source += `(${pattern})${modifier}`;
			}
		} else {
			source += `(?:${escapedPrefix}${escapedSuffix})${modifier}`;
		}
	}

	if (end) {
		if (strict || (source.length > 0 && source !== '^')) {
			source += `${escapedDelimiters}?`;
		}
		source += endsWith ? `(?=${escapedEndsWith})` : '$';
	} else {
		const lastToken = tokens[tokens.length - 1];
		const endsWithDelimiter =
			typeof lastToken === 'string'
				? delimiter.includes(lastToken.slice(-1))
				: lastToken === undefined;
		if (strict || (source.length > 0 && source !== '^')) {
			source += `(?:${escapedDelimiters}(?=${escapedEndsWith}))?`;
		}
		if (!endsWithDelimiter) {
			source += `(?=${escapedDelimiters}|${escapedEndsWith})`;
		}
	}

	return new RegExp(source, getFlags(options));
}

// ==============================
// === Public Functions ===
// ==============================

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 */
export function pathToRegexp(
	path: Path,
	keys: Key[] = [],
	options?: TokensToRegexpOptions & ParseOptions
): RegExp {
	if (path instanceof RegExp) {
		return attachRegExpTokens(path, keys);
	}
	if (Array.isArray(path)) {
		return createPathArrayRegExp(path, keys, options);
	}
	return createPathStringRegExp(path, keys, options);
}

/**
 * Create path match function from `path-to-regexp` spec.
 */
export function match<P extends object = object>(
	str: Path,
	options?: ParseOptions & TokensToRegexpOptions & RegexpToFunctionOptions
): MatchFunction<P> {
	const keys: Key[] = [];
	const regExp = pathToRegexp(str, keys, options);
	return createMatchFunction<P>(regExp, keys, options);
}

/**
 * Create path match function from a regular expression and keys.
 *
 * @private
 */
function createMatchFunction<P extends object = object>(
	regExp: RegExp,
	keys: Key[],
	options: RegexpToFunctionOptions = {}
): MatchFunction<P> {
	const decode =
		options.decode === undefined ? (value: string) => value : options.decode;

	return (path: string) => {
		const matchResult = regExp.exec(path);
		if (!matchResult) {
			return false;
		}

		const { 0: matchedPath, index } = matchResult;
		const params = Object.create(null) as P;

		for (let i = 1; i < matchResult.length; i++) {
			if (matchResult[i] === undefined) {
				continue;
			}
			const key = keys[i - 1];
			if (key.modifier === '*' || key.modifier === '+') {
				(params[key.name as keyof P] as any) = matchResult[i]
					.split(key.prefix + key.suffix)
					.map((value) => decode(value, key));
			} else {
				(params[key.name as keyof P] as any) = decode(matchResult[i], key);
			}
		}

		return {
			path: matchedPath,
			index,
			params,
		};
	};
}
