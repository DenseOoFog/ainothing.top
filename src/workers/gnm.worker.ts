import { Unzip, UnzipInflate } from 'fflate';

type NumericArray = Float32Array | Int32Array;
type Parameters = {
  region: 'east-asian' | 'european';
  faceWidth: number;
  faceLength: number;
  forehead: number;
  cheekbones: number;
  jaw: number;
  chin: number;
  expression: 'neutral' | 'subtle-smile' | 'happy' | 'serious' | 'surprised';
  expressionIntensity: number;
};

const REQUIRED_FILES = new Set([
  'template_vertex_positions.npy',
  'triangles.npy',
  'vertex_groups.npy',
  'vertex_identity_basis.npy',
]);

let template: Float32Array;
let triangles: Uint32Array;
let groups: Float32Array;
let identityBasis: Float32Array;
let vertexCount = 0;
const identityBaselines = new Map<string, Float32Array>();

const EUROPEAN_FEMALE_BASE64 = '4LhfPmjmIT9F1Wm/ANEMvuA3Bz3pHJq+EANhPaaPS76wNDw96Gpwvm3bmD4Nj4W+XCUjP7M5oz44T7K+nBPzPtYSyT5u7rQ+XiTkvsYlKz4idyI+qRKmvbxDbT3fznA++0QrP5C1wj4/AQs/VgyGPy7tEz+6uSY+I1PLviMDLD5w+fa87lm4PoMQT774cMQ+QAF3O+zcnr6hIpm+ON1qP8V2zD3txXw+wJKPPXDZg72s1dm+u+OpPkI7bj+Yq2q/HL97voQSUj9Mipk+AIggPW8UMr7o/Bs+h/kwPpRvOb6EZOY9gF9gPqjVzD4Flv6+7EIJv0JWNb+227s+ZEDkPZmZdT4FLIU+ECxSPnL9SL9mCps+19xPv+5USj2gK+u8hmIBvyS5yD5wCBG+QBdOvxz1IT51QS2/IRSbPkS/FD9JIl6+ESUHPrTVGr9PNhy/C08WPnjplDvnn3S/mKMJvyRYor0UuwS+0iqKvWKOE74NBTE+rYOcPi6c3L6CqzO/Rj2Vv/RoKT4iQjy+HCuTvhw2Hj+owVA9JwE5vqe4n749vSE/mVzIvrZcOb/QFZi9DOfYvR5M8T3JV4Y+f3uQPww6aL9sy0W+U8APv7Ingb6/oQQ/NQdzvstB5b4oZhE99r+evjBpZD3A7tK+YNm8vvTr3r56LAC+CudAP7Pj9b70x5u9yMoYPTTLwr+9b6M/uP02PYIcJz4AOHC5g/tfvyC2uD0DCqs/PnKXvxytIr2cyue+kxRIvyPNPD9tro0+zWuJP77jdj4YdC0/CIP9PRSbLkDLD6U/EGAEP5CWWj48aYg+v2s1PkBMYr55Frk+dgq5vfWetD5ROJS/YSn5vV/ciT+hJUk+Bfd2PjxaPry+YSY9hns0v7htGj3u3WG/fhbePqcAg75M4B48HMNVPuHvWMCAVH0/cMKOOg8VjT+cgYw+oAYZPpjvUj9P4gs/IKKgvlzmPz1rrzY+hOnxPqW0Db94Qy29XrijPehccb5iCEG+wHnUvs5szj2kWlo/kWdpPpFg+j4k8BA9UoWvPZcrsL1Z/rE+sJb8vqefsT7Q8mM80GjPPQYqnz7fhII942GPPz8qIz6geWu8ncXkP8NlVz7Rqby+8tMZvqhyLj9KHKK8PZSDPi1HAj9iTZE+D/BwvkCNnLrKqhg/swkKv4F64T6CJoE+QC86PsKULj8yznw/51GJPgTyvD5SaOy8ZpnxPhx8d76ISI49JFCLPlKvJD+q5BQ+RwLfPpu3gb4ITTk/4ULsPYqZ376aGpG+VI7ovk/Xwr6eRCy/bA26PDAVx72r0fO/u0ERP92AAj8IEUq+GuOAPsdmU791Bwk/efkaPw==';

const FEMALE_IDENTITIES = {
  'east-asian': 'JDN+PjDmGrxLzDK+cg8kPvX7V78/spo+lA7MvrSqe76Tgym/SW2Wvpnbrz4UG0S/XvkGP0EtDL4JxQK/IHWgPl1UjT4NvhE+Gic+v4CFJbvGlB8/l/L0PboK2z4dwZY+jEIxPkvX1j5lrzA/2TyOP+61ej0cvzQ9AjT7vKrSlD5Yz1O9tBYrPw7K5L3s9+4+mHBuvnS3AL+s9ti+2HQdP6cYgj6Oo3g+QOUMPT8/YL6MKPi9EGMFPwzsSj8yW2m/dZsgv2vx6j4v3wM/7PCiPl3NSz7Ayno8HEtvPYdBt71IGyg+wZrcPgu0tj4ROoy+VBUUv6qnRb8T3gY+uvAevQRM/j3N89G9whCRPk9cmb40XsE+UlivviwnTL7aCMQ+2lzSvnDzG70y4Ya+UgVMvwfYwj54WkG+7hhUPr56cT5f+Qm+0DyHvi9Zjr9PotA9WwwuPuYvJL5yO6u+PtCNvrwZtb71CqA+K6ShvmtPwD2CPJU9S6CZP3ynBb6EypW+z8HYvrCVFz2wIOk+m99avsSFjz46gki+RWMnv5ep27623oo/+NI6vVwhF78u39O9uHYEvoI9+z0KdLA+iWGZP4/U4r5n42G/shv2vuOOBz5NuR8/HbcRvzb8Gb5wBMs9o3Ahv2Pv4j4Dyum+55p3PiwUxr46PBu+eP4lvWURnr0AMYc8QDrxOwdRkr+8CEs/BIy8PrThGb98WVG9Fe8Qvt0lnL7fFaA/19q+v/Kb7b7miCq/Kqf0vh68lz46vZ69LkLnPz9NFD6B8Yw/JHArPrZWAkDczlc9JnQaPy8MjD7zYpQ+poSxvrq3Pr43ka09N5Byvgw8Zz97BlW/xHmavs/mTT9+ckI/2ls5PzDDcD+0om8/Yz0JvzWHtj0c1ni/AgWiPof63D5iJSQ8B60sPuvXDcD6LFM/hzSwvBLqWj8M0mA+qHpcP1dhWj934EY/BZqevk1AM77vPnQ+VOoPP7FiHL+H3rO8pGp3PfTdxz1wHsu8Z927voBJGr7G8D8/KXoaPu5VrD5m/qY9gMPHPR3wt77sS4I+RqiQvil3/T7MhDA+VQVlPgJhVD7eRYo+ZjWIP3/xaj54+ES9GZvBP5GDaD7YHwe/5kb3vV7SND9K+bS9+Pl4PLY8ST6K/Ik9KxF1vtktoj0Kn8U+PHMuvmzUlj6qoI8+sIpZvNuuFT8M7ks/kIgOPLMmIj7Y3tS9Ip2aPippgb47dCW9ZE2cPru60j6AYh4+yoVAPv67ur7iPO4+QmK2PiKnR7+4Ib++CC3avh90Eb7uyKi+LPPfPUYz77zWBwDAhFsQP7+6hT5LxUe+X496PgfjhL+Y/D0+4DYSPw==',
  european: EUROPEAN_FEMALE_BASE64,
} as const;

function decodeCoefficients(encoded: string) {
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Float32Array(bytes.buffer);
}

function identityTemplate(region: Parameters['region']) {
  const existing = identityBaselines.get(region);
  if (existing) return existing;
  const coefficients = decodeCoefficients(FEMALE_IDENTITIES[region]);
  const baseline = new Float32Array(template);
  const coordinateCount = vertexCount * 3;
  for (let identity = 0; identity < coefficients.length; identity += 1) {
    const coefficient = coefficients[identity];
    if (Math.abs(coefficient) < 0.00001) continue;
    const basisOffset = identity * coordinateCount;
    for (let coordinate = 0; coordinate < coordinateCount; coordinate += 1) {
      baseline[coordinate] += identityBasis[basisOffset + coordinate] * coefficient;
    }
  }
  identityBaselines.set(region, baseline);
  return baseline;
}

function parseNpy(bytes: Uint8Array): { data: NumericArray; shape: number[] } {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const major = view.getUint8(6);
  const headerLength = major === 1 ? view.getUint16(8, true) : view.getUint32(8, true);
  const headerOffset = major === 1 ? 10 : 12;
  const header = new TextDecoder('latin1').decode(bytes.subarray(headerOffset, headerOffset + headerLength));
  const descr = header.match(/'descr':\s*'([^']+)'/)?.[1];
  const shapeText = header.match(/'shape':\s*\(([^)]*)\)/)?.[1] ?? '';
  const shape = shapeText.split(',').map((value) => Number(value.trim())).filter(Number.isFinite);
  const dataStart = headerOffset + headerLength;
  const raw = bytes.buffer.slice(bytes.byteOffset + dataStart, bytes.byteOffset + bytes.byteLength);
  if (descr === '<f4') return { data: new Float32Array(raw), shape };
  if (descr === '<i4') return { data: new Int32Array(raw), shape };
  throw new Error(`Unsupported NumPy dtype: ${descr}`);
}

async function extractModel(buffer: ArrayBuffer) {
  return new Promise<Map<string, Uint8Array>>((resolve, reject) => {
    const output = new Map<string, Uint8Array>();
    let completed = 0;
    const unzip = new Unzip((file) => {
      if (!REQUIRED_FILES.has(file.name)) return;
      const chunks: Uint8Array[] = [];
      let length = 0;
      file.ondata = (error, chunk, final) => {
        if (error) return reject(error);
        chunks.push(chunk);
        length += chunk.length;
        if (!final) return;
        const joined = new Uint8Array(length);
        let offset = 0;
        for (const item of chunks) {
          joined.set(item, offset);
          offset += item.length;
        }
        output.set(file.name, joined);
        completed += 1;
        if (completed === REQUIRED_FILES.size) resolve(output);
      };
      file.start();
    });
    unzip.register(UnzipInflate);
    try {
      unzip.push(new Uint8Array(buffer), true);
    } catch (error) {
      reject(error);
    }
  });
}

const groupIndex = {
  forehead: 26,
  leftZygomatic: 34,
  rightZygomatic: 35,
  leftCheek: 41,
  rightCheek: 42,
  upperLip: 5,
  lowerLip: 6,
  chin: 45,
};

function groupWeight(group: number, vertex: number) {
  return groups[group * vertexCount + vertex] ?? 0;
}

function deform(parameters: Parameters) {
  const base = identityTemplate(parameters.region);
  const result = new Float32Array(base);
  const expressionAmount = parameters.expressionIntensity / 100;
  for (let vertex = 0; vertex < vertexCount; vertex += 1) {
    const offset = vertex * 3;
    const baseX = base[offset];
    const baseY = base[offset + 1];
    const baseZ = base[offset + 2];
    const faceBand = Math.exp(-Math.pow((baseY - 0.265) / 0.105, 4));
    const lowerBand = Math.max(0, Math.min(1, (0.26 - baseY) / 0.075));
    const foreheadWeight = groupWeight(groupIndex.forehead, vertex);
    const cheekWeight = Math.max(
      groupWeight(groupIndex.leftZygomatic, vertex),
      groupWeight(groupIndex.rightZygomatic, vertex),
      groupWeight(groupIndex.leftCheek, vertex),
      groupWeight(groupIndex.rightCheek, vertex),
    );
    const chinWeight = groupWeight(groupIndex.chin, vertex);
    const upperLip = groupWeight(groupIndex.upperLip, vertex);
    const lowerLip = groupWeight(groupIndex.lowerLip, vertex);
    const lipWeight = Math.max(upperLip, lowerLip);

    result[offset] = baseX * (1 + parameters.faceWidth * 0.085 * faceBand);
    result[offset] *= 1 + parameters.forehead * 0.105 * foreheadWeight;
    result[offset] *= 1 + parameters.cheekbones * 0.115 * cheekWeight;
    result[offset] *= 1 + parameters.jaw * 0.13 * lowerBand * (1 - chinWeight * 0.7);
    result[offset] *= 1 - parameters.chin * 0.18 * chinWeight;
    result[offset + 1] = 0.265 + (baseY - 0.265) * (1 + parameters.faceLength * 0.085 * faceBand);
    result[offset + 1] -= parameters.chin * 0.008 * chinWeight;
    result[offset + 2] = baseZ + parameters.cheekbones * 0.007 * cheekWeight;

    if (lipWeight > 0 && parameters.expression !== 'neutral') {
      const horizontal = Math.min(1, Math.abs(baseX) / 0.023);
      if (parameters.expression === 'subtle-smile' || parameters.expression === 'happy') {
        const strength = parameters.expression === 'happy' ? 0.008 : 0.0045;
        result[offset + 1] += horizontal * strength * expressionAmount * lipWeight;
        result[offset + 2] += 0.002 * expressionAmount * lipWeight;
      } else if (parameters.expression === 'serious') {
        result[offset + 1] -= horizontal * 0.0035 * expressionAmount * lipWeight;
      } else if (parameters.expression === 'surprised') {
        result[offset] *= 1 - 0.08 * expressionAmount * lipWeight;
        result[offset + 1] += (upperLip - lowerLip) * 0.008 * expressionAmount;
      }
    }

    if (parameters.expression === 'happy' && cheekWeight > 0) {
      result[offset + 1] += 0.003 * expressionAmount * cheekWeight;
      result[offset + 2] += 0.002 * expressionAmount * cheekWeight;
    }
  }
  return result;
}

self.onmessage = async (event: MessageEvent) => {
  try {
    if (event.data.type === 'load') {
      const files = await extractModel(event.data.buffer);
      const templateNpy = parseNpy(files.get('template_vertex_positions.npy')!);
      const trianglesNpy = parseNpy(files.get('triangles.npy')!);
      const groupsNpy = parseNpy(files.get('vertex_groups.npy')!);
      const identityBasisNpy = parseNpy(files.get('vertex_identity_basis.npy')!);
      template = templateNpy.data as Float32Array;
      groups = groupsNpy.data as Float32Array;
      identityBasis = identityBasisNpy.data as Float32Array;
      triangles = Uint32Array.from(trianglesNpy.data as Int32Array);
      vertexCount = templateNpy.shape[0];
      const positions = new Float32Array(template);
      self.postMessage(
        { type: 'ready', positions, triangles, vertexCount },
        { transfer: [positions.buffer, triangles.buffer] },
      );
      return;
    }
    if (event.data.type === 'deform' && template) {
      const positions = deform(event.data.parameters);
      self.postMessage({ type: 'geometry', positions }, { transfer: [positions.buffer] });
    }
  } catch (error) {
    self.postMessage({ type: 'error', message: error instanceof Error ? error.message : String(error) });
  }
};
